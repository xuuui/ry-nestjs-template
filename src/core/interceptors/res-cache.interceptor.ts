import { RedisCacheService } from '@/modules/shared/redis-cache/redis-cache.service'
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { map, Observable, of } from 'rxjs'
import { RES_CACHE, RES_CACHE_OPTIONS } from '../constants/decorator'
import { Request } from 'express'
import { isEmpty } from 'lodash'
import { ResCacheOptions } from '../interfaces/sys'

@Injectable()
export class ResCacheInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly redisCache: RedisCacheService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest<Request>()
    const targets = [context.getHandler(), context.getClass()]

    const isCache = this.reflector.getAllAndOverride<boolean>(
      RES_CACHE,
      targets,
    )

    const options = this.reflector.getAllAndOverride<ResCacheOptions>(
      RES_CACHE_OPTIONS,
      targets,
    )

    const key = `res-cache:${req.url}:${req.method}`
    if (isCache) {
      const data = await this.redisCache.get(key)
      if (!isEmpty(data)) {
        return of(data)
      }
    }
    return next.handle().pipe(
      map((data) => {
        const hasTime = !!req.query._t
        if (isCache && !hasTime) {
          this.redisCache.set(key, data, options?.expire)
        }
        return data
      }),
    )
  }
}
