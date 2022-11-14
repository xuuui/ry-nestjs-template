import { applyDecorators } from '@nestjs/common'
import { Column } from 'typeorm'
import { ColumnCommonOptions } from 'typeorm/decorator/options/ColumnCommonOptions'
import { ColumnNumericOptions } from 'typeorm/decorator/options/ColumnNumericOptions'

export type AmountColumnOptions = ColumnCommonOptions &
  ColumnNumericOptions & {}

/**
 * @description: 金额字段
 * @param {AmountColumnOptions} options
 * @return {*}
 */
export function AmountColumn(options?: AmountColumnOptions) {
  const { ...columnOptions } = options || {}
  return applyDecorators(
    Column('decimal', {
      default: 0,
      precision: 10,
      scale: 2,
      transformer: {
        from: Number,
        to: (val) => val,
      },
      ...columnOptions,
    }),
  )
}
