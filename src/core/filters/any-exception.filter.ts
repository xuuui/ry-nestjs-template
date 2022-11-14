import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common'
import { isString } from 'lodash'
import { EHttpStatus } from '@/core/enums/sys.enum'
import { Response } from 'express'
import { HttpResponse, ExceptionOption } from '@/core/interfaces/http'
import { Log4jLoggerService } from '@/modules/logger/log4j-logger.service'
import { EntityNotFoundError } from 'typeorm'
import { InjectLogger } from '@/modules/logger/logger.decorator'

@Catch()
export class AnyExceptionFilter implements ExceptionFilter {
  constructor(
    @InjectLogger(AnyExceptionFilter.name)
    private readonly logger: Log4jLoggerService,
  ) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const res = ctx.getResponse<Response>()

    let ret: HttpResponse
    if (exception instanceof HttpException) {
      const code = exception.getStatus()
      const errorOption = exception.getResponse() as ExceptionOption
      const errMessage = isString(errorOption)
        ? errorOption
        : errorOption.message
      ret = {
        code,
        status: EHttpStatus.FAIL,
        message: errMessage,
      }
    } else if (exception instanceof EntityNotFoundError) {
      ret = {
        code: 200,
        status: EHttpStatus.FAIL,
        message: '数据不存在',
      }
    } else if (exception.code === 'ENOENT') {
      ret = {
        code: exception.statusCode,
        status: EHttpStatus.FAIL,
        message: '资源不存在',
      }
    } else {
      ret = {
        code: 500,
        status: EHttpStatus.FAIL,
        message: exception?.message,
      }
    }
    res.status(ret.code).json(ret)

    const logInfo = this.logger.getHttpLogInfo()
    const context =
      exception instanceof HttpException
        ? `AnyExceptionFilter -> ${exception.name}`
        : exception.code === 'ENOENT'
        ? 'ServeStaticException'
        : 'AnyExceptionFilter'

    if (ret.code >= 500) {
      this.logger.error({ ...logInfo, exception }, context)
    } else if (ret.code >= 400) {
      this.logger.warn({ ...logInfo, exception }, context)
    } else {
      this.logger.log(logInfo, context)
    }
  }
}
