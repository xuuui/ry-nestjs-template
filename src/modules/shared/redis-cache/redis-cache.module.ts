import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { RedisCacheService } from './redis-cache.service'

const services = [RedisCacheService]

@Module({
  imports: [
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        config.get<RedisModuleOptions>('redis'),
    }),
  ],
  providers: [...services],
  exports: [RedisModule, ...services],
})
export class RedisCacheModule {}
