import { applyDecorators } from '@nestjs/common'
import { Column } from 'typeorm'
import { ColumnCommonOptions } from 'typeorm/decorator/options/ColumnCommonOptions'

export type LongtextColumnOptions = ColumnCommonOptions & {}

/**
 * @description: 长文本字段
 * @param {LongtextColumnOptions} options
 * @return {*}
 */
export function LongtextColumn(options?: LongtextColumnOptions) {
  const { ...columnOptions } = options || {}
  return applyDecorators(
    Column('longtext', {
      ...columnOptions,
    }),
  )
}
