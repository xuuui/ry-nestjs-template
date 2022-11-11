import { BaseEntity } from '@/common/base/base.entity'
import { StringValidator } from '@/common/decorators/class-validator/string.decorator'
import { Column, Entity, Index } from 'typeorm'

@Entity({ name: 'sys_account_role' })
export class AccountRoleEntity extends BaseEntity {
  @Index()
  @Column({
    nullable: true,
    comment: '账户id',
  })
  @StringValidator()
  accountId: string

  @Index()
  @Column({
    comment: '角色id',
  })
  @StringValidator()
  roleId: string
}
