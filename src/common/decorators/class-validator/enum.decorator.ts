import { applyDecorators } from '@nestjs/common'
import { Expose } from 'class-transformer'
import { IsEnum, IsOptional } from 'class-validator'

export interface EnumValidatorOptions {
  optional?: boolean
}

export function EnumValidator(entity: object, options?: EnumValidatorOptions) {
  const decorators: PropertyDecorator[] = [Expose()]
  if (options?.optional) {
    decorators.push(IsOptional())
  }
  return applyDecorators(...decorators, IsEnum(entity))
}
