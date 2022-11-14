import { Route } from '@/core/decorators/route.decorator'
import { Module } from '@nestjs/common'
import { AccountModule } from '../account/account.module'
import { UserModule } from '../user/user.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { ThirdAuthService } from './third-atuh.service'

const services = [ThirdAuthService, AuthService]

@Route({
  path: '/auth',
})
@Module({
  imports: [AccountModule, UserModule],
  controllers: [AuthController],
  providers: [...services],
  exports: [...services],
})
export class AuthModule {}
