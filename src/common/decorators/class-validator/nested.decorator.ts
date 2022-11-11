import { applyDecorators } from '@nestjs/common'
import { Expose, Type } from 'class-transformer'
import { IsOptional, ValidateNested } from 'class-validator'

export interface NestedValidatorOptions {
  optional?: boolean
  each?: boolean
}

export function NestedValidator(type: any, options?: NestedValidatorOptions) {
  const { each = false, optional } = options || {}
  const decorators: PropertyDecorator[] = [Expose()]
  if (optional) {
    decorators.push(IsOptional())
  }
  return applyDecorators(
    ...decorators,
    ValidateNested({
      each,
    }),
    Type(() => type),
  )
}
