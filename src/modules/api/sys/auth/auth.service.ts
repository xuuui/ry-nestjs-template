import { AppService } from '@/app/app.service'
import jwtConfig from '@/config/jwt.config'
import { AccountModel } from '@/models/sys/account.model'
import { JwtAuthService } from '@/modules/shared/jwt-auth/jwt-auth.service'
import { RedisCacheService } from '@/modules/shared/redis-cache/redis-cache.service'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { AccountIdentityService } from '../account/account-identity.service'
import { UserService } from '../user/user.service'
import ms from 'ms'
import { ActionFailException } from '@/common/exceptions/action-fail.exception'

@Injectable()
export class AuthService {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtCfg: ConfigType<typeof jwtConfig>,
    private readonly app: AppService,
    private readonly redisCache: RedisCacheService,
    private readonly accountIdentityService: AccountIdentityService,
    private readonly userService: UserService,
    private readonly jwtAuthService: JwtAuthService,
  ) {}

  async accountLogin(account: AccountModel) {
    const identity = await this.accountIdentityService.findOneBy({
      accountId: account.id,
    })
    const user = await this.userService.findOneBy({
      accountId: account.id,
    })
    const token = this.jwtAuthService.generateToken({
      userId: user.id,
      accountId: account.id,
      username: account.username,
      accountType: account.accountType,
    })
    await this.redisCache.set(
      this.redisCache.getTokenKey(account.id, account.accountType),
      token,
      ms(this.jwtCfg.signOptions.expiresIn.toString()),
    )
    this.app.setAuthInfo({
      accountId: account.id,
      userId: user.id,
      username: account.username,
      accountType: account.accountType,
    })
    return {
      user: {
        ...account,
        identity,
        user,
      },
      token,
    }
  }

  async checkCaptcha(random: string, captcha: string) {
    const value = await this.redisCache.get(
      this.redisCache.getCaptchaKey(random),
    )
    if (!value) {
      throw new ActionFailException('验证码过期, 请刷新验证码重试')
    }
    if (value.toLowerCase() !== captcha.toLowerCase()) {
      throw new ActionFailException('验证码错误')
    }
    await this.redisCache.del(this.redisCache.getCaptchaKey(random))
  }
}
