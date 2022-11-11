import { applyDecorators } from '@nestjs/common'
import { Expose } from 'class-transformer'
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

export interface StringValidatorOptions {
  maxLength?: number
  minLength?: number
  optional?: boolean
  each?: boolean
}

export function StringValidator(
  options?: StringValidatorOptions,
): PropertyDecorator {
  const { each = false, maxLength, minLength, optional } = options || {}
  const decorators: PropertyDecorator[] = [Expose()]
  if (optional) {
    decorators.push(IsOptional())
  }
  if (maxLength) {
    decorators.push(MaxLength(options.maxLength))
  }
  if (minLength) {
    decorators.push(MinLength(options.minLength))
  }
  return applyDecorators(
    ...decorators,
    IsString({
      each: each,
    }),
  )
}
