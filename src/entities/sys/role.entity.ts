import { BaseEntity } from '@/core/base/base.entity'
import { EAccountType } from '@/core/enums/sys.enum'
import { Entity, Index } from 'typeorm'
import { StringValidator } from '@/core/decorators/class-validator/string.decorator'
import { EnumValidator } from '@/core/decorators/class-validator/enum.decorator'
import { NumberValidator } from '@/core/decorators/class-validator/number.decorator'
import { ForeignKeyColumn } from '@/core/decorators/typeorm/foreign-key.decorator'
import { CharColumn } from '@/core/decorators/typeorm/char.decorator'
import { EnumColumn } from '@/core/decorators/typeorm/enum.decorator'
import { TinyintColumn } from '@/core/decorators/typeorm/tinyint.decorator'

@Entity({ name: 'sys_role' })
export class RoleEntity extends BaseEntity {
  @ForeignKeyColumn({
    comment: '租户id',
  })
  @StringValidator()
  tenantId: string

  @Index()
  @CharColumn({
    length: 32,
    comment: '名称',
  })
  @StringValidator({
    maxLength: 32,
  })
  name: string

  @CharColumn({
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
