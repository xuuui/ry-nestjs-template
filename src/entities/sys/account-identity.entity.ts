import { BaseEntity } from '@/core/base/base.entity'
import { NumberValidator } from '@/core/decorators/class-validator/number.decorator'
import { StringValidator } from '@/core/decorators/class-validator/string.decorator'
import { ForeignKeyColumn } from '@/core/decorators/typeorm/foreign-key.decorator'
import { TinyintColumn } from '@/core/decorators/typeorm/tinyint.decorator'
import { Entity } from 'typeorm'

@Entity({ name: 'sys_account_identity' })
export class AccountIdentityEntity extends BaseEntity {
  @ForeignKeyColumn({
    comment: '账户id',
  })
  @StringValidator()
  accountId: string

  @TinyintColumn({
    comment: '是否超级管理员',
  })
  @NumberValidator()
  isSuperAdmin: number
}
