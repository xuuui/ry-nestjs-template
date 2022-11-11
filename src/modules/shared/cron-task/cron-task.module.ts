import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { CronTaskService } from './cron-task.service'

const services = [CronTaskService]

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [...services],
  exports: [...services],
})
export class CronTaskModule {}
