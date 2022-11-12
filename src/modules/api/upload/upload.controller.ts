import { Controller, Get, Post, Req } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Request } from 'express'
import { UploadedFile } from 'express-fileupload'
import { QiniuService } from './qiniu.service'
import { UploadService } from './upload.service'

@ApiTags('上传模块')
@Controller()
export class UploadController {
  constructor(
    private readonly qiniuService: QiniuService,
    private readonly service: UploadService,
  ) {}

  @Post()
  async upload(@Req() req: Request) {
    const files = req.files as Recordable<UploadedFile>
    return await this.service.saveFile(files['file'])
  }

  @Get('/getQiniuToken')
  async getQiniuToken() {
    return this.qiniuService.getUploadToken()
  }
}
