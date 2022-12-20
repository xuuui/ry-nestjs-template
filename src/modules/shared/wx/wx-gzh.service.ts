import { Inject, Injectable } from '@nestjs/common'
import { RedisCacheService } from '../redis-cache/redis-cache.service'

import { ConfigType } from '@nestjs/config'
import { AccessTokenApi, ApiConfig, ApiConfigKit } from 'tnwx'
import appConfig from '@/config/app.config'
import wxConfig from '@/config/wx.config'
import wxHttp from './http'

@Injectable()
export class WxGzhService {
  constructor(
    @Inject(wxConfig.KEY)
    private readonly wxCfg: ConfigType<typeof wxConfig>,
    @Inject(appConfig.KEY)
    private readonly appCfg: ConfigType<typeof appConfig>,
    private readonly redisCache: RedisCacheService,
  ) {
    ApiConfigKit.setCache = this.redisCache
    const apiConfig = new ApiConfig(
      this.wxCfg.offiaccount.appId,
      this.wxCfg.offiaccount.appSecret,
      this.appCfg.prefix,
      true,
      this.wxCfg.offiaccount.encodingAESKey,
    )
    ApiConfigKit.putApiConfig(apiConfig)
    ApiConfigKit.setCurrentAppId(apiConfig.getAppId)
  }

  async getUserInfo(openid: string) {
    const accessToken = await AccessTokenApi.getAccessToken()
    const url = `/cgi-bin/user/info?access_token=${accessToken.getAccessToken}`
    const res = await wxHttp.get(url, {
      params: { openid },
    })
    return res.data
  }
}
