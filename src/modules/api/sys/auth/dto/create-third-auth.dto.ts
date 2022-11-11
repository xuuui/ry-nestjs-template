import { EnumValidator } from '@/common/decorators/class-validator/enum.decorator'
import { MobileValidator } from '@/common/decorators/class-validator/mobile.decorator'
import { StringValidator } from '@/common/decorators/class-validator/string.decorator'
import { EThirdPlatform } from '@/common/enums/sys.enum'

export class CreateThirdAuthDto {
  @StringValidator()
  thirdId: string

  @StringValidator({
    optional: true,
  })
  unionid?: string

  @EnumValidator(EThirdPlatform)
  thirdPlatform: EThirdPlatform

  @MobileValidator()
  mobile: string
}
