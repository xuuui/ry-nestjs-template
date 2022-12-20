import { HTTP_HEADER_TOKEN } from '@/core/constants/sys'
import { EAccountType } from '@/core/enums/sys.enum'
import { AuthInfo } from '@/core/interfaces/sys'
import appConfig from '@/config/app.config'
import { RedisCacheService } from '@/modules/shared/redis-cache/redis-cache.service'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { Request, Response } from 'express'
import { ClsService, CLS_REQ, CLS_RES } from 'nestjs-cls'
import publicIp from 'public-ip'

@Injectable()
export class AppService {
  private publicIp: string

  constructor(
    @Inject(appConfig.KEY)
    private readonly appCfg: ConfigType<typeof appConfig>,
    private readonly cls: ClsService,
    private readonly redisCache: RedisCacheService,
  ) {}

  /**
   * @description: 获取请求对象
   * @return {Request}
   */
  getReq(): Request {
    return this.cls.get<Request>(CLS_REQ)
  }

  /**
   * @description: 获取请求id
   * @return {string}
   */
  getReqId(): string {
    return this.cls.getId()
  }

  /**
   * @description: 获取返回对象
   * @return {Response}
   */
  getRes(): Response {
    return this.cls.get<Response>(CLS_RES)
  }

  /**
   * @description: 获取主机域名
   * @return {string}
   */
  getHost(): string {
    const {
      headers: { host },
      protocol,
    } = this.getReq()
    return `${protocol}://${host}`
  }

  /**
   * @description: 获取当前请求的token
   * @return {string}
   */
  getToken(): string {
    const {
      headers: { [HTTP_HEADER_TOKEN]: token },
    } = this.getReq()
    return token as string
  }

  /**
   * @description: 获取客户端ip
   * @return {string}
   */
  getClientIp(): string {
    const { clientIp } = this.getReq()
    return clientIp.replace('::ffff:', '')
  }

  /**
   * @description: 获取主机公网ip
   * @return {string}
   */
  async getPublicIp(): Promise<string> {
    if (this.appCfg.ip) {
      return this.appCfg.ip
    }
    if (!this.publicIp) {
      this.publicIp = await publicIp.v4()
    }
    return this.publicIp
  }

  /**
   * @description: 拼接路径为完整的url
   * @return {string}
   */
  getFileUrl(path: string): string {
    return `${this.getHost()}/${path.replace(/\\/g, '/')}`
  }

  /**
   * @description: 获取文件真实路径
   * @return {string}
   */
  getFilePath(url: string): string {
    return url.replace(`${this.getHost()}/`, '')
  }

  /**
   * @description: 获取登录账户信息
   * @return {string}
   */
  getAuthInfo(): AuthInfo {
    return this.cls.get('authInfo')
  }

  /**
   * @description: 设置登录账户信息
   * @return {string}
   */
  setAuthInfo(authInfo: AuthInfo): void {
    this.cls.set('authInfo', authInfo)
  }

  /**
   * @description: 当前请求是否验证权限
   * @return {string}
   */
  isAuth(): boolean {
    return !!this.getAuthInfo()?.accountId
  }

  /**
   * @description: 账户是否在线
   * @param {string} accountId
   * @param {EAccountType} accountType
   * @return {boolean}
   */
  async isOnLine(
    accountId: string,
    accountType: EAccountType,
  ): Promise<boolean> {
    return !!(await this.redisCache.get(
      this.redisCache.getTokenKey(accountId, accountType),
    ))
  }

  /**
   * @description: 下线账户
   * @param {string} accountId
   * @param {EAccountType} accountType
   * @return {*}
   */
  async logout(accountId: string, accountType: EAccountType): Promise<void> {
    if (await this.isOnLine(accountId, accountType)) {
      this.redisCache.del(this.redisCache.getTokenKey(accountId, accountType))
    }
  }
}
