import { BaseEntity } from 'src/common/base/base.entity'
import { EAccountType } from 'src/common/enums/sys.enum'
import { Column, Entity, Index } from 'typeorm'
import { StringValidator } from '@/common/decorators/class-validator/string.decorator'
import { EnumValidator } from '@/common/decorators/class-validator/enum.decorator'
import { NumberValidator } from '@/common/decorators/class-validator/number.decorator'

@Entity({ name: 'sys_role' })
export class RoleEntity extends BaseEntity {
  @Column({
    nullable: true,
    comment: '租户id',
  })
  @StringValidator()
  tenantId: string

  @Index()
  @Column({
    length: 32,
    comment: '名称',
  })
  @StringValidator({
    maxLength: 32,
  })
  name: string

  @Column({
    default: '',
    comment: '备注',
  })
  @StringValidator()
  remarks: string

  @Column({
    type: 'enum',
    enum: EAccountType,
    comment: '账户类型',
  })
  @EnumValidator(EAccountType)
  accountType: EAccountType

  @Column('tinyint', {
    default: 0,
    comment: '系统数据',
  })
  @NumberValidator()
  isSys: number
}
