import { EnumValidator } from '@/core/decorators/class-validator/enum.decorator'
import { MobileValidator } from '@/core/decorators/class-validator/mobile.decorator'
import { NestedValidator } from '@/core/decorators/class-validator/nested.decorator'
import { NumberValidator } from '@/core/decorators/class-validator/number.decorator'
import { StringValidator } from '@/core/decorators/class-validator/string.decorator'
import { SysDto } from '@/core/dto/sys.dto'
import { EAccountType } from '@/core/enums/sys.enum'
import { Type } from '@nestjs/common'
import { OmitType } from '@nestjs/swagger'
import { CreateUserDto } from '../../user/dto/create-user.dto'

export class CreateAdminAccountDto extends SysDto {
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
  @NestedValidator(OmitType(CreateUserDto, ['accountId']), {
    optional: true,
  })
  user?: Omit<CreateUserDto, 'accountId'>
}
