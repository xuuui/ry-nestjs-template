import { Route } from '@/core/decorators/route.decorator'
import { Module } from '@nestjs/common'
import { OperateLogController } from './operate-log.controller'
import { OperateLogService } from './operate-log.service'

const services = [OperateLogService]

@Route({
  path: '/operate-log',
})
@Module({
  controllers: [OperateLogController],
  exports: [...services],
  providers: [...services],
})
export class OperateLogModule {}
