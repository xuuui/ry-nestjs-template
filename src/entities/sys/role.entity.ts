import { BaseEntity } from 'src/common/base/base.entity'
import { EAccountType } from 'src/common/enums/sys.enum'
import { Entity, Index } from 'typeorm'
import { StringValidator } from '@/common/decorators/class-validator/string.decorator'
import { EnumValidator } from '@/common/decorators/class-validator/enum.decorator'
import { NumberValidator } from '@/common/decorators/class-validator/number.decorator'
import { ForeignKeyColumn } from '@/common/decorators/typeorm/foreign-key.decorator'
import { CharColumn } from '@/common/decorators/typeorm/char.decorator'
import { EnumColumn } from '@/common/decorators/typeorm/enum.decorator'
import { TinyintColumn } from '@/common/decorators/typeorm/tinyint.decorator'

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
