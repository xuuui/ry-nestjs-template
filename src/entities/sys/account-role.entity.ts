import { BaseEntity } from '@/core/base/base.entity'
import { StringValidator } from '@/core/decorators/class-validator/string.decorator'
import { ForeignKeyColumn } from '@/core/decorators/typeorm/foreign-key.decorator'
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
