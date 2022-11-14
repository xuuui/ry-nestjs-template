import { DATE_TEMPLATE } from '@/common/constants/sys'
import { datetimeTransformer } from '@/utils/typeorm'
import { applyDecorators } from '@nestjs/common'
import { Column } from 'typeorm'
import { ColumnCommonOptions } from 'typeorm/decorator/options/ColumnCommonOptions'
import { ColumnNumericOptions } from 'typeorm/decorator/options/ColumnNumericOptions'

export type DatetimeColumnOptions = ColumnCommonOptions &
  ColumnNumericOptions & {
    format?: string
  }

/**
 * @description: 日期字段
 * @param {DatetimeColumnOptions} options
 * @return {*}
 */
export function DatetimeColumn(options?: DatetimeColumnOptions) {
  const { format = DATE_TEMPLATE, ...columnOptions } = options || {}
  return applyDecorators(
    Column('datetime', {
      nullable: true,
      transformer: datetimeTransformer(format),
      ...columnOptions,
    }),
  )
}
