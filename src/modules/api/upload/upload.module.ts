import { Module } from '@nestjs/common'
import { UploadController } from './upload.controller'
import { diskStorage } from 'multer'
import fs from 'fs-extra'
import dayjs from 'dayjs'
import path from 'path'
import { MulterModule } from '@nestjs/platform-express'
import { UploadService } from './upload.service'
import { Route } from '@/common/decorators/route.decorator'
import { ConfigService } from '@nestjs/config'
import { ActionFailException } from '@/common/exceptions/action-fail.exception'
import { QiniuService } from './qiniu.service'
import { AppConfig } from '@/config/types'
import { getNanoid } from '@/utils/func'
import isImage from 'is-image'

const services = [UploadService, QiniuService]

function setupMulter() {
  return MulterModule.registerAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => {
      const storage = diskStorage({
        destination: async (req, file, cb) => {
          const day = dayjs().format('YYYYMMDD')
          const extname = path.extname(file.originalname).replace('.', '')
          const dir = path.join(
            config.get<AppConfig>('app').staticRoot,
            'upload',
            `${extname}`,
            day,
          )
          fs.ensureDirSync(dir)
          cb(null, dir)
        },
        filename: (req, file, cb) => {
          cb(null, `${getNanoid(10)}-${file.originalname}`)
        },
      })
      return {
        storage,
        limits: {
          fileSize: 1024 * 1024 * 100,
        },
        fileFilter: (req, file, cb) => {
          if (!isImage(file.originalname)) {
            cb(new ActionFailException(`文件格式不支持`), false)
            return
          }
          cb(null, true)
        },
      }
    },
  })
}

@Route({
  path: '/upload',
})
@Module({
  imports: [setupMulter()],
  controllers: [UploadController],
  providers: [...services],
  exports: [...services],
})
export class UploadModule {}
