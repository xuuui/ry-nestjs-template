import { applyDecorators } from '@nestjs/common'
import { Transform } from 'class-transformer'
import { isNumberString } from 'class-validator'
import { getBaseValidatorDecorators } from './base.decorator'
import { StringValidator, StringValidatorOptions } from './string.decorator'

export interface NumericValidatorOptions extends StringValidatorOptions {}

export function NumericValidator(options?: NumericValidatorOptions) {
  const decorators = getBaseValidatorDecorators(options)
  return applyDecorators(
    Transform(({ value }) => (isNumberString(value) ? Number(value) : value)),
    ...decorators,
    StringValidator(options),
  )
}
