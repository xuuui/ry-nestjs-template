import { BaseEntity } from '@/common/base/base.entity'
import { EnumValidator } from '@/common/decorators/class-validator/enum.decorator'
import { NumberValidator } from '@/common/decorators/class-validator/number.decorator'
import { NumericValidator } from '@/common/decorators/class-validator/numeric.decorator'
import { StringValidator } from '@/common/decorators/class-validator/string.decorator'
import { CharColumn } from '@/common/decorators/typeorm/char.decorator'
import { EnumColumn } from '@/common/decorators/typeorm/enum.decorator'
import { ForeignKeyColumn } from '@/common/decorators/typeorm/foreign-key.decorator'
import { TinyintColumn } from '@/common/decorators/typeorm/tinyint.decorator'
import { EDictType } from '@/common/enums/sys.enum'
import { Entity, Index } from 'typeorm'

@Entity({ name: 'sys_dict' })
export class DictEntity extends BaseEntity {
  @ForeignKeyColumn({
    comment: '父级id',
  })
  @StringValidator()
  parentId: string

  @Index()
  @CharColumn({
    comment: '编码',
  })
  @StringValidator()
  code: string

  @CharColumn({
    length: 32,
    comment: '名称',
  })
  @StringValidator({
    maxLength: 32,
  })
  label: string

  @CharColumn({
    comment: '值',
  })
  @NumericValidator()
  value: string

  @EnumColumn(EDictType, {
    comment: '类型',
  })
  @EnumValidator(EDictType)
  type: EDictType

  @CharColumn({
    comment: '备注',
  })
  @StringValidator()
  remarks: string

  @TinyintColumn({
    comment: '系统数据',
  })
  @NumberValidator()
  isSys: number
}
