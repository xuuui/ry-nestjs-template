import { EAccountType, EResourceType } from '@/common/enums/sys.enum'
import { SysDto } from '@/common/dto/sys.dto'
import { StringValidator } from '@/common/decorators/class-validator/string.decorator'
import { EnumValidator } from '@/common/decorators/class-validator/enum.decorator'
import { NumberValidator } from '@/common/decorators/class-validator/number.decorator'

export class CreateResourceDto extends SysDto {
  @StringValidator({
    optional: true,
  })
  parentId?: string

  @StringValidator({
    optional: true,
    maxLength: 64,
  })
  name?: string

  @StringValidator({
    maxLength: 32,
  })
  title: string

  @EnumValidator(EResourceType)
  type: EResourceType

  @StringValidator({
    optional: true,
  })
  icon?: string

  @NumberValidator({
    optional: true,
  })
  sort?: number

  @StringValidator({
    optional: true,
  })
  permission?: string

  @StringValidator({
    optional: true,
  })
  path?: string

  @StringValidator({
    optional: true,
  })
  component?: string

  @NumberValidator({
    optional: true,
  })
  isCache?: number

  @NumberValidator({
    optional: true,
  })
  isVisible?: number

  @NumberValidator({
    optional: true,
  })
  state?: number

  @EnumValidator(EAccountType)
  accountType: EAccountType
}
