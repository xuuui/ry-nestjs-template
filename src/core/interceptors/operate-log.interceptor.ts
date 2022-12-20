import { AppService } from '@/app/app.service'
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable, throwError } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { OPERATE_LOG, OPERATE_LOG_OPTIONS } from '@/core/constants/decorator'
import { OperateLogService } from '@/modules/api/sys/operate-log/operate-log.service'
import { OperateLogOptions } from '../interfaces/sys'
import { EAccountType } from '../enums/sys.enum'

@Injectable()
export class OperateLogInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly app: AppService,
    private readonly operateLog: OperateLogService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const targets = [context.getHandler(), context.getClass()]
    const isOperateLog = this.reflector.getAllAndOverride<boolean>(
      OPERATE_LOG,
      targets,
    )
    const operateOptions = this.reflector.getAllAndOverride<OperateLogOptions>(
      OPERATE_LOG_OPTIONS,
      targets,
    )
    const isNeedLog = (): boolean => {
      return (
        this.app.isAuth() &&
        this.app.getAuthInfo().accountType !== EAccountType.CLIENT &&
        isOperateLog
      )
    }

    return next.handle().pipe(
      catchError((err) => {
        if (isNeedLog()) {
          this.operateLog.createOperateLog(operateOptions, err)
        }
        return throwError(() => err)
      }),
      tap(() => {
        if (isNeedLog()) {
          this.operateLog.createOperateLog(operateOptions)
        }
      }),
    )
  }
}
