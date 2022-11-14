import { Route } from '@/core/decorators/route.decorator'
import { Module } from '@nestjs/common'
import { ResourceController } from './resource.controller'
import { ResourceService } from './resource.service'

const services = [ResourceService]

@Route({
  path: '/resource',
})
@Module({
  controllers: [ResourceController],
  exports: [...services],
  providers: [...services],
})
export class ResourceModule {}
