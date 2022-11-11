import { MobileValidator } from '@/common/decorators/class-validator/mobile.decorator'
import { StringValidator } from '@/common/decorators/class-validator/string.decorator'

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
