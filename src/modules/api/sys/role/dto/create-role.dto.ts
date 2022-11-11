import { EnumValidator } from '@/common/decorators/class-validator/enum.decorator'
import { StringValidator } from '@/common/decorators/class-validator/string.decorator'
import { SysDto } from '@/common/dto/sys.dto'
import { EAccountType } from '@/common/enums/sys.enum'

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
