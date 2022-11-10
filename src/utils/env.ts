/**
 * @description: 获取当前环境
 * @return {string}
 */
export const getEnv = (): string => process.env.NODE_ENV || 'development'
/**
 * @description: 是否为开发环境
 * @return {boolean}
 */
export const isDev = (): boolean => getEnv() === 'development'
/**
 * @description: 是否为生产环境
 * @return {boolean}
 */
export const isProd = (): boolean => getEnv() === 'production'
