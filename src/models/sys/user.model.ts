import { BooleanValidator } from '@/common/decorators/class-validator/boolean.decorator'
import { NestedValidator } from '@/common/decorators/class-validator/nested.decorator'
import { UserEntity } from '@/entities/sys/user.entity'
import { AccountModel } from './account.model'

export class UserModel extends UserEntity {
  @NestedValidator(AccountModel, {
    optional: true,
  })
  account?: AccountModel

  @BooleanValidator({
    optional: true,
  })
  isSubscribeGzh?: boolean
}
