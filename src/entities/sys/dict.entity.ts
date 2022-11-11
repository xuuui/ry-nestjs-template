import { BaseEntity } from '@/common/base/base.entity'
import { EnumValidator } from '@/common/decorators/class-validator/enum.decorator'
import { NumberValidator } from '@/common/decorators/class-validator/number.decorator'
import { NumericValidator } from '@/common/decorators/class-validator/numeric.decorator'
import { StringValidator } from '@/common/decorators/class-validator/string.decorator'
import { EDictType } from '@/common/enums/sys.enum'
import { Column, Entity, Index } from 'typeorm'

@Entity({ name: 'sys_dict' })
export class DictEntity extends BaseEntity {
  @Index()
  @Column({
    nullable: true,
    comment: '父级id',
  })
  @StringValidator()
  parentId: string

  @Index()
  @Column({
    comment: '编码',
  })
  @StringValidator()
  code: string

  @Column({
    length: 32,
    comment: '名称',
  })
  @StringValidator({
    maxLength: 32,
  })
  label: string

  @Column({
    comment: '值',
  })
  @NumericValidator()
  value: string

  @Column({
    type: 'enum',
    enum: EDictType,
    comment: '类型',
  })
  @EnumValidator(EDictType)
  type: EDictType

  @Column({
    default: '',
    comment: '备注',
  })
  @StringValidator()
  remarks: string

  @Column('tinyint', {
    default: 0,
    comment: '系统数据',
  })
  @NumberValidator()
  isSys: number
}
