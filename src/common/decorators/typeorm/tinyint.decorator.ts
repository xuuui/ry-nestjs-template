import { applyDecorators } from '@nestjs/common'
import { Column } from 'typeorm'
import { ColumnCommonOptions } from 'typeorm/decorator/options/ColumnCommonOptions'
import { ColumnWithWidthOptions } from 'typeorm/decorator/options/ColumnWithWidthOptions'

export type TinyintColumnOptions = ColumnCommonOptions &
  ColumnWithWidthOptions & {}

/**
 * @description: tinyint 字段
 * @param {TinyintColumnOptions} options
 * @return {*}
 */
export function TinyintColumn(options?: TinyintColumnOptions) {
  const { ...columnOptions } = options || {}
  return applyDecorators(
    Column('tinyint', {
      default: 0,
      ...columnOptions,
    }),
  )
}
