import { EnumValidator } from '@/core/decorators/class-validator/enum.decorator'
import { MobileValidator } from '@/core/decorators/class-validator/mobile.decorator'
import { StringValidator } from '@/core/decorators/class-validator/string.decorator'
import { EThirdPlatform } from '@/core/enums/sys.enum'

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
