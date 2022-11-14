import { applyDecorators, SetMetadata } from '@nestjs/common'
import { RES_TRANSFORM } from '@/core/constants/decorator'

/**
 * @description: 返回结果转换
 * @param {boolean} transform
 * @return {*}
 */
export function ResTransform(transform: boolean = true) {
  return SetMetadata(RES_TRANSFORM, transform)
}

/**
 * @description: 返回结果不转换
 * @return {*}
 */
export function NoResTransform() {
  return applyDecorators(ResTransform(false))
}
