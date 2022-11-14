import { Route } from '@/core/decorators/route.decorator'
import { Module } from '@nestjs/common'
import { AccountIdentityService } from './account-identity.service'
import { AccountController } from './account.controller'
import { AccountService } from './account.service'

const services = [AccountService, AccountIdentityService]

@Route({
  path: '/account',
})
@Module({
  imports: [],
  controllers: [AccountController],
  providers: [...services],
  exports: [...services],
})
export class AccountModule {}
