import { EnumValidator } from '@/core/decorators/class-validator/enum.decorator'
import { StringValidator } from '@/core/decorators/class-validator/string.decorator'
import { SysDto } from '@/core/dto/sys.dto'
import { EAccountType } from '@/core/enums/sys.enum'

export class CreateRoleDto extends SysDto {
  @StringValidator({
    optional: true,
  })
  shopId?: string

  @StringValidator({
    maxLength: 32,
  })
  name: string

  @EnumValidator(EAccountType)
  accountType: EAccountType

  @StringValidator({
    optional: true,
  })
  remarks?: string

  @StringValidator({
    optional: true,
    each: true,
  })
  resourceIds?: string[]
}
