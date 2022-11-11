import { MobileValidator } from '@/common/decorators/class-validator/mobile.decorator'
import { StringValidator } from '@/common/decorators/class-validator/string.decorator'
import { UpdateDto } from '@/common/dto/update.dto'

export class UpdateThirdAuthDto extends UpdateDto {
  @StringValidator({
    optional: true,
  })
  unionid?: string

  @MobileValidator({
    optional: true,
  })
  mobile?: string
}
