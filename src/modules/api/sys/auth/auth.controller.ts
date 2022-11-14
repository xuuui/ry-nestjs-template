import { ActionFailException } from '@/core/exceptions/action-fail.exception'
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { AccountService } from '../account/account.service'
import { AdminLoginDto } from './dto/admin-login.dto'
import { OperateLog } from '@/core/decorators/operate-log.decorator'
import {
  EAccountType,
  EOpertateType,
  EThirdPlatform,
} from '@/core/enums/sys.enum'
import { WxMpService } from '@/modules/shared/wx/wx-mp.service'
import { ThirdAuthService } from './third-atuh.service'
import { AuthService } from './auth.service'
import { WxMpRegisterDto } from './dto/wx-mp-register.dto'
import { comparePassword } from '@/utils/func'
import { AppService } from '@/app/app.service'
import { JwtAuth } from '@/core/decorators/jwt-auth.decorator'

@ApiTags('验证模块')
@Controller()
export class AuthController {
  constructor(
    private readonly service: AuthService,
    private readonly accountService: AccountService,
    private readonly wxMpService: WxMpService,
    private readonly thirdAuthService: ThirdAuthService,
    private readonly app: AppService,
  ) {}

  @ApiOperation({ summary: '后台登录' })
  @OperateLog({
    type: EOpertateType.LOGIN,
  })
  @Post('/adminLogin')
  async adminLogin(@Body() adminLoginDto: AdminLoginDto) {
    const { username, password, accountType, random, captcha } = adminLoginDto
    const account = await this.accountService.findOne({
      where: {
        username,
        accountType,
      },
    })
    if (!account) {
      throw new ActionFailException('账户不存在')
    }
    if (!comparePassword(password, account.password)) {
      throw new ActionFailException('密码错误')
    }
    await this.service.checkCaptcha(random, captcha)
    const loginAccount = await this.service.getLoginAccount(account)
    const token = await this.service.setToken(loginAccount)
    return {
      token,
      account: loginAccount,
    }
  }

  @ApiOperation({ summary: '微信小程序登录' })
  @Post('/wxMpLogin')
  async wxMpLogin(@Body('code') code: string) {
    const { openid, unionid } = await this.wxMpService.code2Session(code)
    const thirdAuthMp = await this.thirdAuthService.findOneBy({
      thirdId: openid,
      thirdPlatform: EThirdPlatform.MP_WEIXIN,
    })

    if (!thirdAuthMp) {
      return {
        token: '',
        user: null,
        openid,
        unionid,
      }
    }

    if (unionid) {
      if (!thirdAuthMp.unionid) {
        await this.thirdAuthService.updateOne({
          id: thirdAuthMp.id,
          unionid,
        })
      }
      await this.thirdAuthService.updateMobileByUnionId(
        unionid,
        thirdAuthMp.mobile,
      )
    }

    const account = await this.accountService.findOneBy({
      mobile: thirdAuthMp.mobile,
      accountType: EAccountType.CLIENT,
    })

    const loginAccount = await this.service.getLoginAccount(account)
    const token = await this.service.setToken(loginAccount)

    return {
      token,
      account: loginAccount,
      openid,
      unionid,
    }
  }

  @ApiOperation({ summary: '微信小程序注册' })
  @Post('/wxMpRegister')
  async wxMpRegister(@Body() wxMpRegisterDto: WxMpRegisterDto) {
    const { openid, mobile, unionid } = wxMpRegisterDto
    const thirdAuthMp = await this.thirdAuthService.createOne({
      thirdId: openid,
      thirdPlatform: EThirdPlatform.MP_WEIXIN,
      mobile,
      unionid,
    })
    if (unionid) {
      await this.thirdAuthService.updateMobileByUnionId(unionid, mobile)
    }
    let account = await this.accountService.findOneBy({
      mobile: thirdAuthMp.mobile,
      accountType: EAccountType.CLIENT,
    })
    if (!account) {
      account = await this.accountService.createClient({
        username: mobile,
        mobile,
      })
    }

    const loginAccount = await this.service.getLoginAccount(account)
    const token = await this.service.setToken(loginAccount)

    return {
      token,
      account: loginAccount,
      openid,
      unionid,
    }
  }

  @ApiOperation({ summary: '获取绑定手机号' })
  @Get('/wxMpGetPhoneNumber')
  async wxMpGetPhoneNumber(@Query('code') code: string) {
    const mobile = await this.wxMpService.getPhoneNumber(code)
    return mobile
  }

  @ApiOperation({ summary: '获取当前登录账户信息' })
  @JwtAuth()
  @Get('/getLoginAccount')
  async getLoginAccount() {
    const accountId = this.app.getAuthInfo().accountId
    const account = await this.accountService.findOneBy({
      id: accountId,
    })
    if (!account) {
      throw new UnauthorizedException('登录会话无效，请重新登录')
    }
    return await this.service.getLoginAccount(account)
  }
}
