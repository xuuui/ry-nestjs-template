import { DATE_TEMPLATE } from '@/common/constants/sys'
import { applyDecorators } from '@nestjs/common'
import dayjs from 'dayjs'
import glob from 'glob'
import { normalize, parse } from 'path'
import { ColumnOptions, ValueTransformer, Column } from 'typeorm'
import { dateFormat, toCamelCase } from './func'

/**
 * @description: 自动加载实体
 * @param {string} entityDir
 * @return {*}
 */
export function loadEntities(entityDir: string): any[] {
  entityDir = normalize(entityDir)
  const entityPath = `${entityDir}/**/*.entity{.ts,.js}`
  return glob
    .sync(entityPath)
    .map((file) => {
      const { name } = parse(file)
      const className = toCamelCase(name)
      return require(file)?.[className]
    })
    .filter(Boolean)
}

/**
 * @description: typeorm datetime类型字段转换器
 * @return {*}
 */
export function datetimeTransformer(
  template: string = DATE_TEMPLATE,
): ValueTransformer {
  return {
    to: (val) => {
      return val ? dayjs(val).toDate() : null
    },
    from: (val) => {
      return dateFormat(val, template)
    },
  }
}
