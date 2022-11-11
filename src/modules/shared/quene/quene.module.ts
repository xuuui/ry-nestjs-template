import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          prefix: config.get('app.prefix') + ':quene',
          url: config.get('redis.config.url'),
        }
      },
    }),
  ],
  exports: [BullModule],
})
export class QueneModule {}
