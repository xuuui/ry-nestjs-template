import { Module } from '@nestjs/common'
import { DictService } from './dict.service'
import { DictController } from './dict.controller'
import { Route } from '@/core/decorators/route.decorator'

const services = [DictService]

@Route({
  path: '/dict',
})
@Module({
  controllers: [DictController],
  exports: [...services],
  providers: [...services],
})
export class DictModule {}
