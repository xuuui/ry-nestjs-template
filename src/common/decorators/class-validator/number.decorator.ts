import { applyDecorators } from '@nestjs/common'
import { Expose } from 'class-transformer'
import { IsNumber, IsOptional } from 'class-validator'

export interface NumberValidatorOptions {
  optional?: boolean
}

export function NumberValidator(options?: NumberValidatorOptions) {
  const decorators: PropertyDecorator[] = [Expose()]
  if (options?.optional) {
    decorators.push(IsOptional())
  }
  return applyDecorators(...decorators, IsNumber())
}
