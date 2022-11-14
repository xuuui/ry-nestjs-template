import { DATE_TEMPLATE } from '@/core/constants/sys'
import { isDate, isDateString } from 'class-validator'
import dayjs from 'dayjs'
import { customAlphabet } from 'nanoid'
import os from 'os'
import bcryptjs from 'bcryptjs'
import { ClassTransformOptions, plainToClassFromExist } from 'class-transformer'
import { merge } from 'lodash'
import { camelCase, upperCaseFirst } from 'change-case-all'

/**
 * @description: 格式化日期
 * @param {string | Date} val
 * @param {string} format
 * @return {*}
 */
export function dateFormat(
  val: string | Date,
  format: string = DATE_TEMPLATE,
): string | null {
  return isDateString(val) || isDate(val) ? dayjs(val).format(format) : null
}

/**
 * @description: 生成唯一id
 * @param {number} size
 * @return {*}
 */
export function getNanoid(size: number = 24): string {
  return customAlphabet(
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    size,
  )()
}

/**
 * @description: 获取本地ip
 * @return {string}
 */
export function getLocalIp(): string {
  const interfaces = os.networkInterfaces()
  for (const devName in interfaces) {
    const iface = interfaces[devName]
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i]
      if (
        alias.family === 'IPv4' &&
        alias.address !== '127.0.0.1' &&
        !alias.internal
      ) {
        return alias.address
      }
    }
  }
}

/**
 * @description: 密码加密
 * @param {string} password
 * @return {*}
 */
export function hashPassword(password: string): string {
  return bcryptjs.hashSync(password, 10)
}

/**
 * @description: 比较加密后的密码
 * @param {string} password
 * @param {string} hashPassword
 * @return {*}
 */
export function comparePassword(
  password: string,
  hashPassword: string,
): Boolean {
  return bcryptjs.compareSync(password, hashPassword)
}

/**
 * @description: 通过class-transformer将plainObject转为class
 * @return {*}
 */
export function toClassFromExist<T, V>(
  clsObject: T,
  plain: V,
  options?: ClassTransformOptions,
): T {
  return plainToClassFromExist(
    clsObject,
    { ...plain },
    merge({ excludeExtraneousValues: true }, options),
  )
}

/**
 * @description: 将字符串转为驼峰
 * @param {string} str
 * @return {*}
 */
export function toCamelCase(str: string) {
  return upperCaseFirst(camelCase(str))
}
