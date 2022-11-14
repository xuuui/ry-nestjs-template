import { RoleController } from './role.controller'
import { Module } from '@nestjs/common'
import { Route } from '@/core/decorators/route.decorator'
import { RoleService } from './role.service'

const services = [RoleService]

@Route({
  path: '/role',
})
@Module({
  controllers: [RoleController],
  providers: [...services],
  exports: [...services],
})
export class RoleModule {}
