import { Module } from '@nestjs/common'
import { UploadController } from './upload.controller'
import { UploadService } from './upload.service'
import { Route } from '@/core/decorators/route.decorator'
import { QiniuService } from './qiniu.service'

const services = [UploadService, QiniuService]

@Route({
  path: '/upload',
})
@Module({
  imports: [],
  controllers: [UploadController],
  providers: [...services],
  exports: [...services],
})
export class UploadModule {}
