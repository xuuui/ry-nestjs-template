import { BaseEntity } from '@/common/base/base.entity'
import { EnumValidator } from '@/common/decorators/class-validator/enum.decorator'
import { NumberValidator } from '@/common/decorators/class-validator/number.decorator'
import { StringValidator } from '@/common/decorators/class-validator/string.decorator'
import { CharColumn } from '@/common/decorators/typeorm/char.decorator'
import { EnumColumn } from '@/common/decorators/typeorm/enum.decorator'
import { ForeignKeyColumn } from '@/common/decorators/typeorm/foreign-key.decorator'
import { TinyintColumn } from '@/common/decorators/typeorm/tinyint.decorator'
import { EAccountType } from '@/common/enums/sys.enum'
import { Entity, Index } from 'typeorm'

@Entity({ name: 'sys_account' })
export class AccountEntity extends BaseEntity {
  @ForeignKeyColumn({
    comment: '租户id',
  })
  @StringValidator()
  tenantId: string

  @Index()
  @CharColumn({
    length: 64,
    comment: '用户名',
  })
  @StringValidator({
    maxLength: 64,
  })
  username: string

  @CharColumn({
    comment: '密码',
  })
  @StringValidator({
    exclude: true,
  })
  password: string

  @Index()
  @CharColumn({
    length: 20,
    comment: '手机号',
  })
  @StringValidator({
    maxLength: 20,
  })
  mobile: string

  @TinyintColumn({
    default: 1,
    comment: '状态: 1正常 0停用',
  })
  @NumberValidator()
  state: number

  @CharColumn({
    length: 20,
    comment: '备注',
  })
  @StringValidator()
  remarks: string

  @EnumColumn(EAccountType, {
    comment: '账户类型',
  })
  @EnumValidator(EAccountType)
  accountType: EAccountType

  @TinyintColumn({
    comment: '系统数据',
  })
  @NumberValidator()
  isSys: number
}
