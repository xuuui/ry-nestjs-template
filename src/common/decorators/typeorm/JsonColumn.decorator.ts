import { applyDecorators } from '@nestjs/common'
import { ColumnOptions, Column } from 'typeorm'

export interface JsonColumnOptions extends ColumnOptions {
  defaultValue?: Array<any> | Object
}

/**
 * @description: JSON字段
 * @param {ColumnOptions} options
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
