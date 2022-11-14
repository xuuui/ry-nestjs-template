import { applyDecorators } from '@nestjs/common'
import { Column, ColumnOptions } from 'typeorm'

export type CharColumnOptions = ColumnOptions & {}

/**
 * @description: 文本字段
 * @param {CharColumnOptions} options
 * @return {*}
 */
export function CharColumn(options?: CharColumnOptions) {
  const { ...columnOptions } = options || {}
  return applyDecorators(
    Column({
      default: '',
      type: 'varchar',
      ...columnOptions,
    }),
  )
}
