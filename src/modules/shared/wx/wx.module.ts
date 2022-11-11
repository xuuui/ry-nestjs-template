import { Module } from '@nestjs/common'
import { WxGzhService } from './wx-gzh.service'
import { WxMpService } from './wx-mp.service'

const services = [WxMpService, WxGzhService]

@Module({
  providers: [...services],
  exports: [...services],
})
export class WxModule {}
