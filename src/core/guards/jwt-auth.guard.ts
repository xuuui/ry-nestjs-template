import { AppService } from '@/app/app.service'
import { JwtAuthService } from '@/modules/shared/jwt-auth/jwt-auth.service'
import { RedisCacheService } from '@/modules/shared/redis-cache/redis-cache.service'
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { isNil } from 'lodash'
import { JWT_AUTH } from '../constants/decorator'
import { HTTP_HEADER_TOKEN } from '../constants/sys'

// 默认是否验证jwt
const DEFAULT_JWT_AUTH = false

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly app: AppService,
    private readonly redisCache: RedisCacheService,
    private readonly jwtAuth: JwtAuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let isJwtAuth = this.reflector.getAllAndOverride<boolean>(JWT_AUTH, [
      context.getHandler(),
      context.getClass(),
    ])

    isJwtAuth = isNil(isJwtAuth) ? DEFAULT_JWT_AUTH : isJwtAuth

    if (!isJwtAuth) return true

    const req = context.switchToHttp().getRequest<Request>()

    const token = req.headers?.[HTTP_HEADER_TOKEN.toLowerCase()] as string

    if (token) {
      try {
        const authInfo = await this.jwtAuth.verifyToken(token)

        const onLineToken = await this.redisCache.get(
          this.redisCache.getTokenKey(authInfo.accountId, authInfo.accountType),
        )

        if (!onLineToken) throw new Error('登录会话已经过期，请重新登录')

        if (onLineToken !== token)
          throw new Error('账号已在他处登录，请重新登录')

        this.app.setAuthInfo(authInfo)

        return true
      } catch (error) {
        if (error.name === 'TokenExpiredError')
          throw new UnauthorizedException('登录会话已经过期，请重新登录')
        else if (error.name === 'JsonWebTokenError')
          throw new UnauthorizedException('登录会话无效，请重新登录')
        else {
          throw new UnauthorizedException(error ?? '登录会话失效，请重新登录')
        }
      }
    } else throw new UnauthorizedException('缺少凭证')
  }
}
