import { applyDecorators } from '@nestjs/common'
import { Expose } from 'class-transformer'
import { IsMobilePhone, IsOptional, ValidateIf } from 'class-validator'

export interface MobileValidatorOptions {
  optional?: boolean
}

export function MobileValidator(options?: MobileValidatorOptions) {
  const decorators: PropertyDecorator[] = [Expose()]
  if (options?.optional) {
    decorators.push(IsOptional())
  }
  return applyDecorators(
    ...decorators,
    ValidateIf((obj, val) => !!val),
    IsMobilePhone('zh-CN', {}),
  )
}
