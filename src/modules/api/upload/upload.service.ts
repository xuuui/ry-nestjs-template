import { Injectable } from '@nestjs/common'
import { readFileSync, writeFileSync } from 'fs-extra'
import imagemin from 'imagemin'
import imageminPngquant from 'imagemin-pngquant'
import imageminMozjpeg from 'imagemin-mozjpeg'
import { join } from 'path'

@Injectable()
export class UploadService {
  async compressImage(filePath: string) {
    const path = join(process.cwd(), filePath)
    const img = readFileSync(path)
    const buf = await imagemin.buffer(img, {
      plugins: [imageminMozjpeg(), imageminPngquant()],
    })
    writeFileSync(path, buf)
  }
}
