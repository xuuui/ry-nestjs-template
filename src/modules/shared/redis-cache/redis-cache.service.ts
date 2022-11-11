import { EAccountType, EThirdPlatform } from '@/common/enums/sys.enum'
import appConfig from '@/config/app.config'
import { InjectRedis } from '@liaoliaots/nestjs-redis'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import Redis from 'ioredis'

@Injectable()
export class RedisCacheService {
  constructor(
    @Inject(appConfig.KEY)
    private readonly appCfg: ConfigType<typeof appConfig>,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  private get prefix() {
    return this.appCfg.prefix + ':'
  }

  getRedis() {
    return this.redis
  }

  async set(key: string, value: any, timeout?: number): Promise<any> {
    key = this.prefix + key
    value = JSON.stringify(value)
    if (!timeout) {
      return await this.redis.set(key, value)
    } else {
      return await this.redis.set(key, value, 'EX', timeout)
    }
  }

  async get(key: string): Promise<any> {
    key = this.prefix + key
    const value = await this.redis.get(key)
    if (value) {
      return JSON.parse(value)
    } else {
      return null
    }
  }

  async del(key: string): Promise<any> {
    key = this.prefix + key
    return await this.redis.del(key)
  }

  async remove(key: string): Promise<any> {
    return await this.del(key)
  }

  async flushall(): Promise<any> {
    return await this.redis.flushall()
  }

  getTokenKey(id: string, accountType: EAccountType): string {
    return `token:${accountType}:${id}`
  }

  getCaptchaKey(random: string): string {
    return `captcha:${random}`
  }

  getAcceccTokenKey(type: EThirdPlatform): string {
    return `acceccToken:${type}`
  }
}
