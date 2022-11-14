import { applyDecorators } from '@nestjs/common'
import { IsMobilePhone, ValidateIf } from 'class-validator'
import {
  BaseValidatorOptions,
  getBaseValidatorDecorators,
} from './base.decorator'

export type MobileValidatorOptions = BaseValidatorOptions

export function MobileValidator(options?: MobileValidatorOptions) {
  const decorators = getBaseValidatorDecorators(options)
  return applyDecorators(
    ...decorators,
    ValidateIf((obj, val) => !!val),
    IsMobilePhone('zh-CN', {}),
  )
}
