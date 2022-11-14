import { applyDecorators } from '@nestjs/common'
import { Column, ColumnOptions } from 'typeorm'

export type EnumColumnOptions = ColumnOptions & {}

/**
 * @description: 枚举字段
 * @param {EnumColumnOptions} options
 * @return {*}
 */
export function EnumColumn(
  enumObj: Object | Array<string | number>,
  options?: EnumColumnOptions,
) {
  const { ...columnOptions } = options || {}
  return applyDecorators(
    Column({
      type: 'enum',
      enum: enumObj,
      ...columnOptions,
    }),
  )
}
