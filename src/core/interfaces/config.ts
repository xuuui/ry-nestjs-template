import { RedisModuleOptions } from '@liaoliaots/nestjs-redis'
import { JwtModuleOptions } from '@nestjs/jwt'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'

/**
 * @description: 应用配置
 */
export interface AppConfig {
  /**
   * @description: 端口
   */
  port: number
  /**
   * @description: 全局前缀
   */
  prefix: string
  /**
   * @description: 接口前缀
   */
  apiPrefix: string
  /**
   * @description: 静态资源目录
   */
  staticRoot: string
  /**
   * @description: 应用域名
   */
  domain: string
  /**
   * @description: 应用ip
   */
  ip: string
  /**
   * @description: 默认管理员账号
   */
  defaltAccount: {
    username: string
    password: string
  }
}
/**
 * @description: jwt配置
 */
export type JwtConfig = JwtModuleOptions
/**
 * @description: redis配置
 */
export type RedisConfig = RedisModuleOptions
/**
 * @description: typeorm配置
 */
export type TypeormConfig = TypeOrmModuleOptions

/**
 * @description: 微信配置
 */
export interface WxConfig {
  /**
   * @description: 公众号配置
   */
  offiaccount: {
    appId: string
    appSecret: string
    encodingAESKey: string
  }
  /**
   * @description: 小程序配置
   */
  miniprogram: {
    appId: string
    appSecret: string
  }
  /**
   * @description: 商户号id
   */
  mchId: string
  /**
   * @description: 商户号秘钥
   */
  mchSecret: string
  /**
   * @description: cert路径
   */
  certPath: string
}
