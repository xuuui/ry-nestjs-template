import { applyDecorators } from '@nestjs/common'
import { Type } from 'class-transformer'
import { ValidateNested, ValidationOptions } from 'class-validator'
import {
  BaseValidatorOptions,
  getBaseValidatorDecorators,
} from './base.decorator'

export type NestedValidatorOptions = BaseValidatorOptions & ValidationOptions

export function NestedValidator(type: any, options?: NestedValidatorOptions) {
  const { each = false, ...baseOptions } = options || {}
  const decorators = getBaseValidatorDecorators(baseOptions)
  return applyDecorators(
    ...decorators,
    ValidateNested({
      each,
    }),
    Type(() => type),
  )
}
