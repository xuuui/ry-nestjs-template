import { DATE_TEMPLATE } from '@/common/constants/sys'
import { dateFormat } from '@/utils/func'
import { applyDecorators } from '@nestjs/common'
import { Expose, Transform } from 'class-transformer'
import { IsDateString, IsOptional, ValidateIf } from 'class-validator'

export interface DateStringValidatorOptions {
  format?: string
  optional?: boolean
}

export function DateStringValidator(options?: DateStringValidatorOptions) {
  const { format = DATE_TEMPLATE } = options || {}
  const decorators = [
    Expose(),
    Transform(({ value }) => dateFormat(value, format)),
  ]
  if (options?.optional) {
    decorators.push(IsOptional())
  }
  return applyDecorators(
    ...decorators,
    ValidateIf((obj, value) => {
      if (value === 'Invalid Date') return false
      return !!value
    }),
    IsDateString(),
  )
}
