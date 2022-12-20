import { applyDecorators, SetMetadata } from '@nestjs/common'
import { RES_CACHE, RES_CACHE_OPTIONS } from '@/core/constants/decorator'
import { ResCacheOptions } from '../interfaces/sys'
import { merge } from 'lodash'

/**
 * @description: 返回结果缓存
 * @param {boolean} cache
 * @return {*}
 */
export function ResCache(options?: ResCacheOptions) {
  return applyDecorators(
    SetMetadata(RES_CACHE, true),
    SetMetadata(
      RES_CACHE_OPTIONS,
      merge<ResCacheOptions, ResCacheOptions>({ expire: 60 }, options),
    ),
  )
}
