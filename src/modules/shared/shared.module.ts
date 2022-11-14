import { Global, Module } from '@nestjs/common'
import { CronTaskModule } from './cron-task/cron-task.module'
import { EventModule } from './event/event.module'
import { JwtAuthModule } from './jwt-auth/jwt-auth.module'
import { QueneModule } from './quene/quene.module'
import { RedisCacheModule } from './redis-cache/redis-cache.module'
import { WxModule } from './wx/wx.module'

const modules = [
  JwtAuthModule,
  RedisCacheModule,
  QueneModule,
  CronTaskModule,
  EventModule,
  WxModule,
]

@Global()
@Module({
  imports: [...modules],
  exports: [...modules],
})
export class SharedModule {}
