import { applyDecorators } from '@nestjs/common'
import { Column, ColumnOptions, Index } from 'typeorm'

export type ForeignKeyColumnOptions = ColumnOptions & {}

/**
 * @description: 外键字段
 * @param {ForeignKeyColumnOptions} options
 * @return {*}
 */
export function ForeignKeyColumn(options?: ForeignKeyColumnOptions) {
  const { ...columnOptions } = options || {}
  return applyDecorators(
    Index,
    Column({
      nullable: true,
      ...columnOptions,
    }),
  )
}
