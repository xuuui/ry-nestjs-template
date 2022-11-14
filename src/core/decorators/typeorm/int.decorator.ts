import { applyDecorators } from '@nestjs/common'
import { Column, ColumnOptions } from 'typeorm'

export type IntColumnOptions = ColumnOptions & {}

/**
 * @description: 整型字段
 * @param {IntColumnOptions} options
 * @return {*}
 */
export function IntColumn(options?: IntColumnOptions) {
  const { ...columnOptions } = options || {}
  return applyDecorators(
    Column({
      type: 'int',
      ...columnOptions,
    }),
  )
}
