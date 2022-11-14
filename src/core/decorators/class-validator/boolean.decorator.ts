import { applyDecorators } from '@nestjs/common'
import { IsBoolean } from 'class-validator'
import {
  BaseValidatorOptions,
  getBaseValidatorDecorators,
} from './base.decorator'

export type BooleanValidatorOptions = BaseValidatorOptions

export function BooleanValidator(options?: BooleanValidatorOptions) {
  const decorators = getBaseValidatorDecorators(options)
  return applyDecorators(...decorators, IsBoolean())
}
