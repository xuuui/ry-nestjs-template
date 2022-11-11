import { AppService } from '@/app/app.service'
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { OPERATE_LOG, OPERATE_OPTIONS } from '@/common/constants/decorator'
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
      OPERATE_OPTIONS,
      targets,
    )

    return next.handle().pipe(
      tap(() => {
        if (
          this.app.isAuth() &&
          this.app.getAuthInfo().accountType !== EAccountType.CLIENT &&
          isOperateLog
        ) {
          this.operateLog.createOperateLog(operateOptions)
        }
      }),
    )
  }
}
