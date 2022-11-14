import { AppConfig } from '@/core/interfaces/config'
import { RedisCacheService } from '@/modules/shared/redis-cache/redis-cache.service'
import { ConfigService } from '@nestjs/config'
import { RateLimiterModule } from 'nestjs-rate-limiter'

export function setupRateLimiter() {
  return RateLimiterModule.registerAsync({
    inject: [ConfigService, RedisCacheService],
    useFactory: (config: ConfigService, redisCache: RedisCacheService) => {
      const appCfg = config.get<AppConfig>('app')
      const keyPrefix = appCfg.prefix + ':rate-limit'
      return {
        keyPrefix,
        type: 'Redis',
        errorMessage: '访问的频率太快了, 请稍后再试',
        storeClient: redisCache.getRedis(),
        customResponseSchema: ({ msBeforeNext }) => {
          const time = (msBeforeNext / 1000).toFixed(0)
          return `访问的频率太快了, 请${time}秒后重试`
        },
      }
    },
  })
}
