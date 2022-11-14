import { Exclude, Expose } from 'class-transformer'
import { IsOptional } from 'class-validator'

export interface BaseValidatorOptions {
  optional?: boolean
  exclude?: boolean
}

export function getBaseValidatorDecorators(options?: BaseValidatorOptions) {
  const { optional = false, exclude = false } = options || {}
  const decorators: PropertyDecorator[] = []
  decorators.push(exclude ? Exclude() : Expose())
  if (optional) {
    decorators.push(IsOptional())
  }
  return decorators
}
