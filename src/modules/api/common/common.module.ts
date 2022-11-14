import { Route } from '@/core/decorators/route.decorator'
import { Module } from '@nestjs/common'
import { AccountModule } from '../sys/account/account.module'

import { CommonController } from './common.controller'
import { CommonService } from './common.service'

const modules = []
const services = [CommonService]

@Route({
  path: '/common',
  children: [...modules],
})
@Module({
  imports: [...modules, AccountModule],
  controllers: [CommonController],
  providers: [...services],
  exports: [...modules, ...services],
})
export class CommonModule {}
