import { Log4jLoggerService } from '@/modules/logger/log4j-logger.service'
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly logger: Log4jLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const before = Date.now()

    return next.handle().pipe(
      tap(() => {
        this.logger.log(
          {
            ...this.logger.getHttpLogInfo(),
            time: Date.now() - before,
          },
          `${context.getClass().name} -> ${context.getHandler().name}`,
        )
      }),
    )
  }
}
