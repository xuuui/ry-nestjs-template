import { MobileValidator } from '@/core/decorators/class-validator/mobile.decorator'
import { StringValidator } from '@/core/decorators/class-validator/string.decorator'

export class WxMpRegisterDto {
  @StringValidator()
  openid: string

  @MobileValidator()
  mobile: string

  @StringValidator({
    optional: true,
  })
  unionid?: string
}
