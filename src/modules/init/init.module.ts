import { Module } from '@nestjs/common'
import { AccountModule } from '../api/sys/account/account.module'
import { InitService } from './init.service'

@Module({
  imports: [AccountModule],
  providers: [InitService],
  exports: [InitService],
})
export class InitModule {}
