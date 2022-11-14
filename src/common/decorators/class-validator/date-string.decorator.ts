import { DATE_TEMPLATE } from '@/common/constants/sys'
import { dateFormat } from '@/utils/func'
import { applyDecorators } from '@nestjs/common'
import { Transform } from 'class-transformer'
import { IsDateString, ValidateIf } from 'class-validator'
import {
  BaseValidatorOptions,
  getBaseValidatorDecorators,
} from './base.decorator'

export type DateStringValidatorOptions = BaseValidatorOptions & {
  format?: string
}

export function DateStringValidator(options?: DateStringValidatorOptions) {
  const { format = DATE_TEMPLATE, ...args } = options || {}
  const decorators = getBaseValidatorDecorators(args)
  return applyDecorators(
    Transform(({ value }) => dateFormat(value, format)),
    ...decorators,
    ValidateIf((obj, value) => {
      if (value === 'Invalid Date') return false
      return !!value
    }),
    IsDateString(),
  )
}
