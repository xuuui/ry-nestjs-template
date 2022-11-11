import { BaseEntity } from '@/common/base/base.entity'
import { NumberValidator } from '@/common/decorators/class-validator/number.decorator'
import { StringValidator } from '@/common/decorators/class-validator/string.decorator'
import { Column, Entity, Index } from 'typeorm'

@Entity({ name: 'sys_account_identity' })
export class AccountIdentityEntity extends BaseEntity {
  @Index()
  @Column({
    nullable: true,
    comment: '账户id',
  })
  @StringValidator()
  accountId: string

  @Column('tinyint', {
    default: 0,
    comment: '是否超级管理员',
  })
  @NumberValidator()
  isSuperAdmin: number
}
