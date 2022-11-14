import { MobileValidator } from '@/core/decorators/class-validator/mobile.decorator'
import { NestedValidator } from '@/core/decorators/class-validator/nested.decorator'
import { StringValidator } from '@/core/decorators/class-validator/string.decorator'
import { OmitType } from '@nestjs/swagger'
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

  @NestedValidator(OmitType(CreateUserDto, ['accountId']), {
    optional: true,
  })
  user?: Omit<CreateUserDto, 'accountId'>
}
