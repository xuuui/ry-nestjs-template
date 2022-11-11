import { BaseEntity } from '@/common/base/base.entity'
import { EnumValidator } from '@/common/decorators/class-validator/enum.decorator'
import { NumberValidator } from '@/common/decorators/class-validator/number.decorator'
import { StringValidator } from '@/common/decorators/class-validator/string.decorator'
import { EAccountType } from '@/common/enums/sys.enum'
import { Exclude } from 'class-transformer'
import { IsString } from 'class-validator'
import { Column, Entity, Index } from 'typeorm'

@Entity({ name: 'sys_account' })
export class AccountEntity extends BaseEntity {
  @Column({
    nullable: true,
    comment: '租户id',
  })
  @StringValidator()
  tenantId: string

  @Index()
  @Column({
    length: 64,
    comment: '用户名',
  })
  @StringValidator({
    maxLength: 64,
  })
  username: string

  @Column({
    default: '',
    comment: '密码',
  })
  @Exclude()
  @IsString()
  password: string

  @Index()
  @Column({
    default: '',
    length: 20,
    comment: '手机号',
  })
  @StringValidator({
    maxLength: 20,
  })
  mobile: string

  @Column('tinyint', {
    default: 1,
    comment: '状态: 1正常 0停用',
  })
  @NumberValidator()
  state: number

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
