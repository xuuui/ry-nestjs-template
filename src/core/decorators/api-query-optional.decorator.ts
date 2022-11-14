import { applyDecorators } from '@nestjs/common'
import { ApiQuery } from '@nestjs/swagger'

/**
 * @description: swagger 分页请求
 * @param {string} name
 * @return {*}
 */
export function ApiQueryOptional(name: string) {
  return applyDecorators(
    ApiQuery({
      name,
      required: false,
    }),
  )
}
