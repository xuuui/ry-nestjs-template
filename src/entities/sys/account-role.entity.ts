import { BaseEntity } from '@/common/base/base.entity'
import { StringValidator } from '@/common/decorators/class-validator/string.decorator'
import { ForeignKeyColumn } from '@/common/decorators/typeorm/foreign-key.decorator'
import { Entity } from 'typeorm'

@Entity({ name: 'sys_account_role' })
export class AccountRoleEntity extends BaseEntity {
  @ForeignKeyColumn({
    comment: '账户id',
  })
  @StringValidator()
  accountId: string

  @ForeignKeyColumn({
    comment: '角色id',
  })
  @StringValidator()
  roleId: string
}
