import { getEnv } from '@/utils/env'
import { isNaN, isUndefined, mergeWith } from 'lodash'

/**
 * @description: 合并环境配置
 * @param {*} config 配置
 * @param {*} envConfig 环境配置
 * @return {*}
 */
export function mergeEnvConfig<T>(config: T, envConfig: Partial<T>): T {
  return mergeWith<T, Partial<T>>(config, envConfig, (obj, src) => {
    if (isUndefined(src) || isNaN(src)) return obj
  })
}

/**
 * @description: 获取当前环境的配置
 * @return {string}
 */
export function getEnvConfigFile(): string {
  return `.env.${getEnv()}`
}

/**
 * @description: 字符串转布尔
 * @param {string} str
 * @param {boolean} defVal
 * @return {boolean}
 */
export function strToBool(str: string, defVal: boolean = false): boolean {
  if (str === 'true') return true
  if (str === 'false') return false
  return defVal
}

export function getRedisUrl(
  host: string,
  port: number,
  password: string,
): string {
  return `redis://${password ? ':' + password : ''}@${host}:${port}`
}
