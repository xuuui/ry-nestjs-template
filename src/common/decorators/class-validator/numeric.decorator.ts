import { applyDecorators } from '@nestjs/common'
import { Transform } from 'class-transformer'
import { isNumberString } from 'class-validator'
import { StringValidator, StringValidatorOptions } from './string.decorator'

export interface NumericValidatorOptions extends StringValidatorOptions {}

export function NumericValidator(options?: NumericValidatorOptions) {
  const decorators: PropertyDecorator[] = [
    Transform(({ value }) => (isNumberString(value) ? Number(value) : value)),
    StringValidator(options),
  ]
  return applyDecorators(...decorators)
}
