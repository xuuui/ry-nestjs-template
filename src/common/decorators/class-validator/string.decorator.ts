import { applyDecorators } from '@nestjs/common'
import { IsString, MaxLength, MinLength } from 'class-validator'
import {
  BaseValidatorOptions,
  getBaseValidatorDecorators,
} from './base.decorator'

export type StringValidatorOptions = BaseValidatorOptions & {
  maxLength?: number
  minLength?: number
  each?: boolean
}

export function StringValidator(
  options?: StringValidatorOptions,
): PropertyDecorator {
  const { each = false, maxLength, minLength, ...baseOptions } = options || {}
  const decorators = getBaseValidatorDecorators(baseOptions)
  if (maxLength) {
    decorators.push(MaxLength(options.maxLength))
  }
  if (minLength) {
    decorators.push(MinLength(options.minLength))
  }
  return applyDecorators(
    ...decorators,
    IsString({
      each: each,
    }),
  )
}
