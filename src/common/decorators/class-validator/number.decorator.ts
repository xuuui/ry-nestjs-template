import { applyDecorators } from '@nestjs/common'
import { IsNumber } from 'class-validator'
import {
  BaseValidatorOptions,
  getBaseValidatorDecorators,
} from './base.decorator'

export type NumberValidatorOptions = BaseValidatorOptions

export function NumberValidator(options?: NumberValidatorOptions) {
  const decorators = getBaseValidatorDecorators(options)
  return applyDecorators(...decorators, IsNumber())
}
