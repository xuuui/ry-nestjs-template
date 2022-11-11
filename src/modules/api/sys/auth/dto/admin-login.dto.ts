import { EnumValidator } from '@/common/decorators/class-validator/enum.decorator'
import { StringValidator } from '@/common/decorators/class-validator/string.decorator'
import { EAccountType } from '@/common/enums/sys.enum'

export enum EAdminAccountType {
  MANAGE = EAccountType.MANAGE,
}

export class AdminLoginDto {
  /**
   * @description: 用户名
   */
  @StringValidator()
  username: string

  /**
   * @description: 密码
   */
  @StringValidator()
  password: string

  /**
   * @description: 账户类型
   */
  @EnumValidator(EAccountType)
  accountType: EAccountType

  /**
   * @description: 验证码
   */
  @StringValidator()
  captcha: string

  /**
   * @description: 随机id
   */
  @StringValidator()
  random: string
}
