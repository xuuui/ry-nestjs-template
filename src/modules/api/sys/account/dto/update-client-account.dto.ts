import { MobileValidator } from '@/common/decorators/class-validator/mobile.decorator'
import { NestedValidator } from '@/common/decorators/class-validator/nested.decorator'
import { NumberValidator } from '@/common/decorators/class-validator/number.decorator'
import { UpdateDto } from '@/common/dto/update.dto'
import { UpdateUserDto } from '../../user/dto/update-user.dto'

export class UpdateClientAccountDto extends UpdateDto {
  @MobileValidator({
    optional: true,
  })
  mobile?: string

  @NumberValidator({
    optional: true,
  })
  state?: number

  @NestedValidator(UpdateUserDto, {
    optional: true,
  })
  user?: UpdateUserDto
}
