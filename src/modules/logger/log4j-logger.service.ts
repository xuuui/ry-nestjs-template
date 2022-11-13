import { AppService } from '@/app/app.service'
import { HTTP_HEADER_TOKEN } from '@/common/constants/sys'
import { HttpLogInfo } from '@/common/interfaces/sys'
import { Injectable, LoggerService, Scope } from '@nestjs/common'
import log4js from 'log4js'
import { getLogger } from './log4j'

@Injectable({
  scope: Scope.TRANSIENT,
})
export class Log4jLoggerService implements LoggerService {
  private readonly logger: log4js.Logger
  private context?: string

  constructor(private readonly app: AppService) {
    this.logger = getLogger('')
  }

  setContext(context: string) {
    this.context = context
    this.logger.addContext('context', context)
  }

  clearContext() {
    this.logger.clearContext()
  }

  splitContext(...args: any[]) {
    const ctx = args?.[args.length - 1] ?? null
    return {
      ctx,
      rest: ctx ? args.slice(0, args.length - 1) : args,
    }
  }

  private warpCtx(fn: Function, message: any, ...args: any[]) {
    const { ctx, rest } = this.splitContext(...args)
    if (ctx) {
      this.setContext(ctx)
    }
    fn.bind(this.logger)(message, ...rest)
    if (ctx) {
      this.setContext(this.context)
    }
  }

  log(message: any, ...args: any[]) {
    this.warpCtx(this.logger.info, message, ...args)
  }

  error(message: any, ...args: any[]) {
    this.warpCtx(this.logger.error, message, ...args)
  }

  warn(message: any, ...args: any[]) {
    this.warpCtx(this.logger.warn, message, ...args)
  }

  debug(message: any, ...args: any[]) {
    this.warpCtx(this.logger.debug, message, ...args)
  }

  verbose(message: any, ...args: any[]) {
    this.warpCtx(this.logger.trace, message, ...args)
  }

  getHttpLogInfo(): HttpLogInfo {
    const {
      headers: { [HTTP_HEADER_TOKEN.toLowerCase()]: token },
      method,
      path,
      params,
      query,
      body,
    } = this.app.getReq()
    const { statusCode } = this.app.getRes()

    return {
      clientIp: this.app.getClientIp(),
      reqId: this.app.getReqId(),
      token: token as string,
      req: {
        statusCode,
        method,
        path,
        params,
        query,
        body,
      },
    }
  }
}
