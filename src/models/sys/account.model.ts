import { NestedValidator } from '@/core/decorators/class-validator/nested.decorator'
import { NumberValidator } from '@/core/decorators/class-validator/number.decorator'
import { AccountEntity } from '@/entities/sys/account.entity'
import { AccountIdentityModel } from './account-identity.model'
import { RoleModel } from './role.model'
import { UserModel } from './user.model'

export class AccountModel extends AccountEntity {
  @NestedValidator(AccountIdentityModel, {
    optional: true,
  })
  identity?: AccountIdentityModel

  @NestedValidator(UserModel, {
    optional: true,
  })
  user?: UserModel

  @NestedValidator(RoleModel, {
    optional: true,
    each: true,
  })
  roles?: RoleModel[]

  @NumberValidator()
  isSubscribeGzh?: number
}
