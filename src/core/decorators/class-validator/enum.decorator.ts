import { applyDecorators } from '@nestjs/common'
import { IsEnum } from 'class-validator'
import {
  BaseValidatorOptions,
  getBaseValidatorDecorators,
} from './base.decorator'

export type EnumValidatorOptions = BaseValidatorOptions

export function EnumValidator(entity: object, options?: EnumValidatorOptions) {
  const decorators = getBaseValidatorDecorators(options)
  return applyDecorators(...decorators, IsEnum(entity))
}
