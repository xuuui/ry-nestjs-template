import { EnumValidator } from '@/common/decorators/class-validator/enum.decorator'
import { MobileValidator } from '@/common/decorators/class-validator/mobile.decorator'
import { NestedValidator } from '@/common/decorators/class-validator/nested.decorator'
import { NumberValidator } from '@/common/decorators/class-validator/number.decorator'
import { StringValidator } from '@/common/decorators/class-validator/string.decorator'
import { SysDto } from '@/common/dto/sys.dto'
import { EAccountType } from '@/common/enums/sys.enum'
import { CreateUserDto } from '../../user/dto/create-user.dto'

export class CreateAdminAccountDto extends SysDto {
  @StringValidator({
    optional: true,
  })
  shopId?: string

  @StringValidator({
    maxLength: 64,
  })
  username: string

  @StringValidator({
    maxLength: 24,
    minLength: 6,
  })
  password: string

  @MobileValidator({
    optional: true,
  })
  mobile?: string

  @NumberValidator({
    optional: true,
  })
  state?: number

  @EnumValidator(EAccountType)
  accountType: EAccountType

  @StringValidator({
    optional: true,
  })
  remarks?: string

  @NumberValidator({
    optional: true,
  })
  isSuperAdmin?: number

  /**
   * @description: 绑定角色ids
   * @return {*}
   */
  @StringValidator({
    optional: true,
    each: true,
  })
  roleIds?: string[]

  /**
   * @description: 创建用户信息
   * @return {*}
   */
  @NestedValidator(CreateUserDto, {
    optional: true,
  })
  user?: CreateUserDto
}
