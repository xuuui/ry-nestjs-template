import { Route } from '@/core/decorators/route.decorator'
import { Module } from '@nestjs/common'
import { CommonModule } from './common/common.module'
import { SysModule } from './sys/sys.module'
import { UploadModule } from './upload/upload.module'

const modules = [UploadModule, CommonModule, SysModule]

@Route({
  path: '/api',
  children: [...modules],
})
@Module({
  imports: [...modules],
  exports: [...modules],
})
export class ApiModule {}
