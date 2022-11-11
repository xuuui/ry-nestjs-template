import { RateLimiterGuard, RateLimiterOptions } from 'nestjs-rate-limiter'
import { Request } from 'express'
import { Reflector } from '@nestjs/core'
import { Injectable } from '@nestjs/common'
import { AppService } from '@/app/app.service'

@Injectable()
export class ReqLimitGuard extends RateLimiterGuard {
  constructor(
    options: RateLimiterOptions,
    reflector: Reflector,
    private readonly app: AppService,
  ) {
    super(options, reflector)
  }

  protected getIpFromRequest(request: Request): string {
    const { path } = request
    let key = this.app.getClientIp()
    if (this.app.isAuth()) {
      key += `:${this.app.getAuthInfo().accountId}`
    }
    key += `:${path}`
    return key
  }
}
