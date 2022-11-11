import { applyDecorators, SetMetadata } from '@nestjs/common'
import { JWT_AUTH } from '@/common/constants/decorator'
import { ApiBearerAuth } from '@nestjs/swagger'

/**
 * @description: jwt验证
 * @param {boolean} auth
 * @return {*}
 */
export function JwtAuth(auth: boolean = true) {
  return applyDecorators(SetMetadata(JWT_AUTH, auth), ApiBearerAuth())
}

/**
 * @description: 不需要jwt验证
 * @return {*}
 */
export function NoJwtAuth() {
  return applyDecorators(SetMetadata(JWT_AUTH, false))
}
