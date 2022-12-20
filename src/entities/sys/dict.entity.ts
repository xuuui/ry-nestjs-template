import { BaseEntity } from '@/core/base/base.entity'
import { EnumValidator } from '@/core/decorators/class-validator/enum.decorator'
import { NumberValidator } from '@/core/decorators/class-validator/number.decorator'
import { StringValidator } from '@/core/decorators/class-validator/string.decorator'
import { CharColumn } from '@/core/decorators/typeorm/char.decorator'
import { EnumColumn } from '@/core/decorators/typeorm/enum.decorator'
import { ForeignKeyColumn } from '@/core/decorators/typeorm/foreign-key.decorator'
import { TinyintColumn } from '@/core/decorators/typeorm/tinyint.decorator'
import { EDictType } from '@/core/enums/sys.enum'
import { Transform } from 'class-transformer'
import { isNumberString } from 'class-validator'
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

  @Index()
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
    transformer: {
      from: (value: string) => {
        return isNumberString(value) ? Number(value) : value
      },
      to: (value) => value,
    },
  })
  @Transform(({ value }) => (isNumberString(value) ? Number(value) : value))
  @StringValidator()
  value: number | string

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
