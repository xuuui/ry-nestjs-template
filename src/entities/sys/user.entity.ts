import { BaseEntity } from '@/common/base/base.entity'
import { BIRTH_DATE_TEMPLATE } from '@/common/constants/sys'
import { DateStringValidator } from '@/common/decorators/class-validator/date-string.decorator'
import { NumberValidator } from '@/common/decorators/class-validator/number.decorator'
import { StringValidator } from '@/common/decorators/class-validator/string.decorator'
import { datetimeTransformer } from '@/utils/typeorm'
import { Column, Entity, Index } from 'typeorm'

@Entity({ name: 'sys_user' })
export class UserEntity extends BaseEntity {
  @Index()
  @Column({
    nullable: true,
    comment: '账户id',
  })
  @StringValidator()
  accountId: string

  @Index()
  @Column({
    default: '',
    comment: '昵称',
  })
  @StringValidator()
  nickname: string

  @Column({
    default: '',
    comment: '头像',
    length: 2080,
  })
  @StringValidator({
    maxLength: 2080,
  })
  avatar: string

  @Column('tinyint', {
    default: 0,
    comment: '0未知 男1 女2',
  })
  @NumberValidator()
  sex: number

  @Index()
  @Column({
    default: '',
    length: 128,
    comment: '真实姓名',
  })
  @StringValidator({
    maxLength: 128,
  })
  realname: string

  @Column('datetime', {
    nullable: true,
    comment: '出生日期',
    transformer: datetimeTransformer(BIRTH_DATE_TEMPLATE),
  })
  @DateStringValidator({
    format: BIRTH_DATE_TEMPLATE,
  })
  birthDate: string

  @Column({
    nullable: true,
    comment: '年龄',
  })
  @NumberValidator()
  age: number

  @Column({
    default: '',
    comment: '简介',
  })
  @StringValidator()
  remarks: string
}
