import { MobileValidator } from '@/core/decorators/class-validator/mobile.decorator'
import { StringValidator } from '@/core/decorators/class-validator/string.decorator'
import { UpdateDto } from '@/core/dto/update.dto'

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
