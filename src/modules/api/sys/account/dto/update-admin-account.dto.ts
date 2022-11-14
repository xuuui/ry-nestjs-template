import { MobileValidator } from '@/core/decorators/class-validator/mobile.decorator'
import { NestedValidator } from '@/core/decorators/class-validator/nested.decorator'
import { NumberValidator } from '@/core/decorators/class-validator/number.decorator'
import { StringValidator } from '@/core/decorators/class-validator/string.decorator'
import { SysDto } from '@/core/dto/sys.dto'
import { UpdateDto } from '@/core/dto/update.dto'
import { IntersectionType, OmitType } from '@nestjs/swagger'
import { UpdateUserDto } from '../../user/dto/update-user.dto'

export class UpdateAdminAccountDto extends IntersectionType(UpdateDto, SysDto) {
  @StringValidator({
    optional: true,
  })
  shopId?: string

  @StringValidator({
    optional: true,
    maxLength: 24,
    minLength: 6,
  })
  password?: string

  @MobileValidator({
    optional: true,
  })
  mobile?: string

  @NumberValidator({
    optional: true,
  })
  state?: number

  @StringValidator({
    optional: true,
  })
  remarks?: string

  @StringValidator({
    optional: true,
    each: true,
  })
  roleIds?: string[]

  @NestedValidator(OmitType(UpdateUserDto, ['id']), {
    optional: true,
  })
  user?: Omit<UpdateUserDto, 'id'>
}
