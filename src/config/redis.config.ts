import { registerAs } from '@nestjs/config'
import type { RedisConfig } from './types'
import { getRedisUrl, mergeEnvConfig } from './utils'

const config: RedisConfig = {
  readyLog: true,
}

export default registerAs('redis', (): RedisConfig => {
  return mergeEnvConfig(config, {
    commonOptions: {
      keyPrefix: process.env.PREFIX,
    },
    config: {
      url: getRedisUrl(
        process.env.REDIS_HOST,
        Number(process.env.REDIS_PORT),
        process.env.REDIS_PASSWORD,
      ),
    },
  })
})
