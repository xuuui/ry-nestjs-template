import { applyDecorators } from '@nestjs/common'
import { Expose } from 'class-transformer'
import { IsBoolean, IsOptional } from 'class-validator'

export interface BooleanValidatorOptions {
  optional?: boolean
}

export function BooleanValidator(options?: BooleanValidatorOptions) {
  const decorators: PropertyDecorator[] = [Expose()]
  if (options?.optional) {
    decorators.push(IsOptional())
  }
  return applyDecorators(...decorators, IsBoolean())
}
