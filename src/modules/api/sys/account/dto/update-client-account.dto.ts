import { MobileValidator } from '@/core/decorators/class-validator/mobile.decorator'
import { NestedValidator } from '@/core/decorators/class-validator/nested.decorator'
import { NumberValidator } from '@/core/decorators/class-validator/number.decorator'
import { UpdateDto } from '@/core/dto/update.dto'
import { OmitType } from '@nestjs/swagger'
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

  @NestedValidator(OmitType(UpdateUserDto, ['id']), {
    optional: true,
  })
  user?: UpdateUserDto
}
