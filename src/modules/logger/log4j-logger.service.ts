import { AppService } from '@/app/app.service'
import { HTTP_HEADER_TOKEN } from '@/common/constants/sys'
import { HttpLogInfo } from '@/common/interfaces/sys'
import { Injectable, LoggerService } from '@nestjs/common'
import { nestLogger } from './log4j'

@Injectable()
export class Log4jLoggerService implements LoggerService {
  constructor(private readonly app: AppService) {}

  log(message: any, context?: string, ...args: any[]) {
    nestLogger.addContext('context', context)
    nestLogger.info(message, ...args)
  }
  error(message: any, context?: string, ...args: any[]) {
    nestLogger.addContext('context', context)
    nestLogger.error(message, ...args)
  }
  warn(message: any, context?: string, ...args: any[]) {
    nestLogger.addContext('context', context)
    nestLogger.warn(message, ...args)
  }
  debug(message: any, context?: string, ...args: any[]) {
    nestLogger.addContext('context', context)
    nestLogger.debug(message, ...args)
  }

  verbose(message: any, context?: string, ...args: any[]) {
    nestLogger.addContext('context', context)
    nestLogger.trace(message, ...args)
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
