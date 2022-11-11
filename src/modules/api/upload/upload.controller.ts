import { AppService } from '@/app/app.service'
import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiTags } from '@nestjs/swagger'
import { QiniuService } from './qiniu.service'
import { UploadService } from './upload.service'

@ApiTags('上传模块')
@Controller()
export class UploadController {
  constructor(
    private readonly qiniuService: QiniuService,
    private readonly service: UploadService,
    private readonly app: AppService,
  ) {}

  @UseInterceptors(FileInterceptor('file'))
  @Post()
  async upload(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    if (file.size > 1024 * 1024 * 0.4) {
      await this.service.compressImage(file.path)
    }
    return this.app.getFileUrl(file.path)
  }

  @Get('/getQiniuToken')
  async getQiniuToken() {
    return this.qiniuService.getUploadToken()
  }
}
