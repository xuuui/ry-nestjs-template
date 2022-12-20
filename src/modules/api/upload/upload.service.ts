import { Inject, Injectable } from '@nestjs/common'
import { ensureDirSync, writeFileSync } from 'fs-extra'
import { join, extname } from 'path'
import { UploadedFile } from 'express-fileupload'
import { getNanoid } from '@/utils/func'
import appConfig from '@/config/app.config'
import { ConfigType } from '@nestjs/config'
import dayjs from 'dayjs'
import { AppService } from '@/app/app.service'

@Injectable()
export class UploadService {
  constructor(
    @Inject(appConfig.KEY)
    private readonly appCfg: ConfigType<typeof appConfig>,
    private readonly app: AppService,
  ) {}

  async saveFile(file: UploadedFile) {
    let name = file.name.split('.')[0]
    name = `${name}-${getNanoid(10)}`
    const extName = extname(file.name).replace('.', '')
    const day = dayjs().format('YYYYMMDD')
    const dir = join(this.appCfg.staticRoot, 'upload', `${extName}`, day)
    ensureDirSync(dir)
    const path = join(dir, `${name}.${extName}`)
    let buffer: Buffer = file.data
    writeFileSync(path, buffer)
    return this.app.getFileUrl(path)
  }
}
