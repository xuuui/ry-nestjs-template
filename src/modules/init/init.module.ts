import { Module } from '@nestjs/common'
import { AccountModule } from '../api/sys/account/account.module'
import { DictModule } from '../api/sys/dict/dict.module'
import { ResourceModule } from '../api/sys/resource/resource.module'
import { InitService } from './init.service'

@Module({
  imports: [AccountModule, DictModule, ResourceModule],
  providers: [InitService],
  exports: [InitService],
})
export class InitModule {}
