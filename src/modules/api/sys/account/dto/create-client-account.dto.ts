import { MobileValidator } from '@/common/decorators/class-validator/mobile.decorator'
import { NestedValidator } from '@/common/decorators/class-validator/nested.decorator'
import { StringValidator } from '@/common/decorators/class-validator/string.decorator'
import { CreateUserDto } from '../../user/dto/create-user.dto'

export class CreateClientAccountDto {
  @StringValidator({
    maxLength: 64,
  })
  username: string

  @MobileValidator({
    optional: true,
  })
  mobile?: string

  @NestedValidator(CreateUserDto, {
    optional: true,
  })
  user?: CreateUserDto
}
