import axios from 'axios'
import { Inject, Injectable } from '@nestjs/common'
import { RedisCacheService } from '../redis-cache/redis-cache.service'
import { ConfigType } from '@nestjs/config'
import {
  Kits,
  HttpKit,
  WX_TRADE_TYPE,
  SIGN_TYPE,
  WX_DOMAIN,
  WX_API_TYPE,
} from 'tnwx'
import { readFileSync } from 'fs-extra'
import appConfig from '@/config/app.config'
import wxConfig from '@/config/wx.config'
import { EThirdPlatform } from '@/core/enums/sys.enum'
import { join } from 'path'
import { AppService } from '@/app/app.service'

const URL_MAP = {
  jscode2session: 'https://api.weixin.qq.com/sns/jscode2session',
  getwxacodeunlimit: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit',
  token: 'https://api.weixin.qq.com/cgi-bin/token',
  getuserphonenumber:
    'https://api.weixin.qq.com/wxa/business/getuserphonenumber',
  subscribesend: 'https://api.weixin.qq.com/cgi-bin/message/subscribe/send',
}

@Injectable()
export class WxMpService {
  constructor(
    @Inject(wxConfig.KEY)
    private readonly wxCfg: ConfigType<typeof wxConfig>,
    @Inject(appConfig.KEY)
    private readonly appCfg: ConfigType<typeof appConfig>,
    private readonly app: AppService,
    private readonly redisCache: RedisCacheService,
  ) {}

  get notifyUrl(): string {
    const domain = this.appCfg.domain
    return `${domain}/api/common/payNotify`
  }
  get appId(): string {
    return this.wxCfg.miniprogram.appId
  }
  get appSecret(): string {
    return this.wxCfg.miniprogram.appSecret
  }
  get certPath(): string {
    return this.wxCfg.certPath
  }
  get acceccTokenKey(): string {
    return this.redisCache.getAcceccTokenKey(EThirdPlatform.MP_WEIXIN)
  }

  async code2Session(code: string): Promise<any> {
    const { data } = await axios.get(URL_MAP.jscode2session, {
      params: {
        appid: this.appId,
        secret: this.appSecret,
        js_code: code,
        grant_type: 'authorization_code',
      },
    })

    if (data?.errcode) {
      throw new Error(data.errmsg)
    }

    return data
  }

  async isAccessTokenExpired(acceccToken: string): Promise<boolean> {
    const url = URL_MAP.getwxacodeunlimit + `?access_token=${acceccToken}`
    const { data } = await axios.post(url)
    // 如果 40001说明accesstoken过期，则重新获取
    if (data.errcode === 40001) {
      return true
    }
    return false
  }

  async getAccessToken(): Promise<string> {
    let acceccToken = await this.redisCache.get(this.acceccTokenKey)

    if (await this.isAccessTokenExpired(acceccToken)) {
      acceccToken = null
    }
    if (!acceccToken) {
      const { data } = await axios.get(URL_MAP.token, {
        params: {
          appid: this.appId,
          secret: this.appSecret,
          grant_type: 'client_credential',
        },
      })
      if (data?.errcode) {
        throw new Error(data.errmsg)
      }
      await this.redisCache.set(
        this.acceccTokenKey,
        data.access_token,
        data.expires_in - 10,
      )
      return data.access_token
    }
    return acceccToken
  }

  async refreshAccessToken(): Promise<string> {
    await this.redisCache.del(this.acceccTokenKey)
    return await this.getAccessToken()
  }

  async getPhoneNumber(code: string): Promise<string> {
    const url =
      URL_MAP.getuserphonenumber +
      `?access_token=${await this.getAccessToken()}`
    const res = await axios.post(url, {
      code,
    })
    if (res.data?.errcode) {
      throw new Error(res.data.errmsg)
    }
    return res.data?.phone_info?.phoneNumber || ''
  }

  async refund(opt: { orderNo: string; money: number; totalMoney: number }) {
    const refundObj = {
      appid: this.appId,
      mch_id: this.wxCfg.mchId,
      nonce_str: Kits.generateStr(), //生成随机字符串
      out_trade_no: opt.orderNo,
      out_refund_no: opt.orderNo,
      total_fee: opt.totalMoney,
      refund_fee: opt.money,
    }
    const xml = await Kits.generateSignedXml(
      refundObj,
      this.wxCfg.mchSecret,
      SIGN_TYPE.SIGN_TYPE_MD5,
    )
    const pfx: Buffer = readFileSync(join(this.wxCfg.certPath))
    const data = await HttpKit.getHttpDelegate.httpPostWithCert(
      WX_DOMAIN.CHINA.concat(WX_API_TYPE.REFUND),
      xml,
      pfx,
      this.wxCfg.mchId,
    )
    return await Kits.xml2obj(data)
  }

  async pay({
    openid,
    orderNo,
    money,
    body,
  }: {
    openid: string
    orderNo: string
    money: number
    body: string
  }): Promise<any> {
    const reqObj = {
      appid: this.appId,
      mch_id: this.wxCfg.mchId,
      nonce_str: Kits.generateStr(),
      body,
      out_trade_no: orderNo,
      total_fee: money,
      spbill_create_ip: await this.app.getPublicIp(),
      notify_url: this.notifyUrl,
      openid,
      trade_type: WX_TRADE_TYPE.JSAPI,
      sign_type: SIGN_TYPE.SIGN_TYPE_MD5,
    }
    const xml = await Kits.generateSignedXml(
      reqObj,
      this.wxCfg.mchSecret,
      SIGN_TYPE.SIGN_TYPE_MD5,
    )
    const res = await HttpKit.getHttpDelegate.httpPost(
      WX_DOMAIN.CHINA.concat(WX_API_TYPE.UNIFIED_ORDER),
      xml,
    )
    return Kits.xml2obj(res)
  }

  getPaySign(
    nonceStr: string,
    package_: string,
    timeStamp: string,
    signType: string = SIGN_TYPE.SIGN_TYPE_MD5,
  ) {
    const params = new URLSearchParams()
    params.set('appId', this.appId)
    params.set('nonceStr', nonceStr)
    params.set('package', package_)
    params.set('signType', signType)
    params.set('timeStamp', timeStamp)
    params.set('key', this.wxCfg.mchSecret)
    return Kits.md5(decodeURIComponent(params.toString()))
  }

  async sendSubscribeMessage(
    userOpenid: string,
    templateId: string,
    data: Record<string, any>,
    page?: string,
    miniprogramState: string = 'formal',
  ): Promise<boolean> {
    const url =
      URL_MAP.subscribesend + `?access_token=${await this.getAccessToken()}`
    const res = await axios.post(url, {
      touser: userOpenid,
      template_id: templateId,
      data: data,
      page,
      miniprogram_state: miniprogramState,
    })
    if (res.data?.errcode) {
      throw new Error(res.data.errmsg)
    }
    return true
  }

  async getQrCode({ scene, page }: { scene: string; page: string }) {
    const url =
      URL_MAP.getwxacodeunlimit + `?access_token=${await this.getAccessToken()}`
    const res = await axios.post(
      url,
      {
        scene,
        page,
      },
      {
        responseType: 'arraybuffer',
      },
    )
    if (res.data?.errcode) {
      throw new Error(res.data.errmsg)
    }
    return res.data
  }
}
