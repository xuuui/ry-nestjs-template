import { Route } from '@/common/decorators/route.decorator'
import { Module } from '@nestjs/common'
import { AccountModule } from './account/account.module'
import { AuthModule } from './auth/auth.module'
import { DictModule } from './dict/dict.module'
import { OperateLogModule } from './operate-log/operate-log.module'
import { ResourceModule } from './resource/resource.module'
import { RoleModule } from './role/role.module'
import { SysController } from './sys.controller'
import { SysService } from './sys.service'
import { UserModule } from './user/user.module'

const modules = [
  UserModule,
  AccountModule,
  RoleModule,
  ResourceModule,
  DictModule,
  AuthModule,
  OperateLogModule,
]
const services = [SysService]

@Route({
  path: '/sys',
  children: [...modules],
})
@Module({
  imports: [...modules],
  controllers: [SysController],
  providers: [...services],
  exports: [...modules, ...services],
})
export class SysModule {}
