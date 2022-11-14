import { applyDecorators } from '@nestjs/common'
import { Column } from 'typeorm'
import { ColumnCommonOptions } from 'typeorm/decorator/options/ColumnCommonOptions'

export type JsonColumnOptions = ColumnCommonOptions & {
  defaultValue?: Array<any> | Object
}

/**
 * @description: JSON字段
 * @param {JsonColumnOptions} options
 * @return {*}
 */
export function JsonColumn(options?: JsonColumnOptions) {
  const { defaultValue = {}, ...columnOptions } = options || {}
  return applyDecorators(
    Column('longtext', {
      transformer: {
        to: (val) => {
          return JSON.stringify(val)
        },
        from: (val) => {
          return JSON.parse(val || JSON.stringify(defaultValue))
        },
      },
      ...columnOptions,
    }),
  )
}
