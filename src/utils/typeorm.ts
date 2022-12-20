import { DATE_TEMPLATE } from '@/core/constants/sys'
import dayjs from 'dayjs'
import glob from 'glob'
import { normalize, parse } from 'path'
import { ValueTransformer } from 'typeorm'
import { toCamelCase } from './func'

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
 * @description: typeorm datetime转换器
 * @return {*}
 */
export function datetimeTransformer(
  format: string = DATE_TEMPLATE,
): ValueTransformer {
  return {
    to: (val) => {
      return dayjs(val).isValid() ? dayjs(val).toDate() : null
    },
    from: (val) => {
      return val
    },
  }
}

/**
 * @description: typeorm 数字转换器
 * @return {*}
 */
export function numberTransformer(): ValueTransformer {
  return {
    from: Number,
    to: (val) => val,
  }
}

/**
 * @description: typeorm json转换器
 * @return {*}
 */
export function jsonTransformer<T>(defalutValue: T): ValueTransformer {
  return {
    to: (val: T): string => {
      return JSON.stringify(val)
    },
    from: (val: string): T => {
      return JSON.parse(val || JSON.stringify(defalutValue))
    },
  }
}
