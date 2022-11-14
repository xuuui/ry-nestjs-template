import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common'
import { Response } from 'express'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { EHttpStatus } from '@/core/enums/sys.enum'
import { HttpResponse } from '@/core/interfaces/http'
import { Reflector } from '@nestjs/core'
import { RES_TRANSFORM } from '@/core/constants/decorator'
import { isNullOrUnDef } from '@/utils/is'

const DEFAULT_RES_TRANSFORM = true

@Injectable()
export class ResTransformInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<HttpResponse> {
    return next.handle().pipe(
      map((data): HttpResponse => {
        const res = context.switchToHttp().getResponse<Response>()

        if (res.statusCode === 201) res.statusCode = 200

        let isResTransform = this.reflector.getAllAndOverride<boolean>(
          RES_TRANSFORM,
          [context.getHandler(), context.getClass()],
        )

        isResTransform = isNullOrUnDef(isResTransform)
          ? DEFAULT_RES_TRANSFORM
          : isResTransform

        if (!isResTransform) return data

        return {
          code: res.statusCode,
          result: isNullOrUnDef(data) ? {} : data,
          status: EHttpStatus.SUCCESS,
          message: 'The action is successful',
        }
      }),
    )
  }
}
