import { jsonTransformer } from '@/utils/typeorm'
import { applyDecorators } from '@nestjs/common'
import { Column } from 'typeorm'
import { ColumnCommonOptions } from 'typeorm/decorator/options/ColumnCommonOptions'

export type JsonColumnOptions<T> = ColumnCommonOptions & {
  defaultValue?: T
}

/**
 * @description: JSON字段
 * @param {JsonColumnOptions} options
 * @return {*}
 */
export function JsonColumn<T>(options?: JsonColumnOptions<T>) {
  const { defaultValue = {}, ...columnOptions } = options || {}
  return applyDecorators(
    Column('longtext', {
      transformer: jsonTransformer(defaultValue),
      ...columnOptions,
    }),
  )
}
