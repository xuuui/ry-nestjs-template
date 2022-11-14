import { Route } from '@/core/decorators/route.decorator'
import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'

const services = [UserService]

@Route({
  path: '/user',
})
@Module({
  controllers: [UserController],
  providers: [...services],
  exports: [...services],
})
export class UserModule {}
