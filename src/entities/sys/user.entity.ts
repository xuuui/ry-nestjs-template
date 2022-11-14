import { BaseEntity } from '@/common/base/base.entity'
import { BIRTH_DATE_TEMPLATE } from '@/common/constants/sys'
import { DateStringValidator } from '@/common/decorators/class-validator/date-string.decorator'
import { NumberValidator } from '@/common/decorators/class-validator/number.decorator'
import { StringValidator } from '@/common/decorators/class-validator/string.decorator'
import { CharColumn } from '@/common/decorators/typeorm/char.decorator'
import { DatetimeColumn } from '@/common/decorators/typeorm/datetime.decorator'
import { ForeignKeyColumn } from '@/common/decorators/typeorm/foreign-key.decorator'
import { IntColumn } from '@/common/decorators/typeorm/int.decorator'
import { TinyintColumn } from '@/common/decorators/typeorm/tinyint.decorator'
import { Entity, Index } from 'typeorm'

@Entity({ name: 'sys_user' })
export class UserEntity extends BaseEntity {
  @ForeignKeyColumn({
    comment: '账户id',
  })
  @StringValidator()
  accountId: string

  @Index()
  @CharColumn({
    comment: '昵称',
  })
  @StringValidator()
  nickname: string

  @CharColumn({
    comment: '头像',
    length: 2080,
  })
  @StringValidator({
    maxLength: 2080,
  })
  avatar: string

  @TinyintColumn({
    comment: '0未知 男1 女2',
  })
  @NumberValidator()
  sex: number

  @Index()
  @CharColumn({
    length: 128,
    comment: '真实姓名',
  })
  @StringValidator({
    maxLength: 128,
  })
  realname: string

  @DatetimeColumn({
    format: BIRTH_DATE_TEMPLATE,
    comment: '出生日期',
  })
  @DateStringValidator({
    format: BIRTH_DATE_TEMPLATE,
  })
  birthDate: string

  @IntColumn({
    comment: '年龄',
  })
  @NumberValidator()
  age: number

  @CharColumn({
    comment: '简介',
  })
  @StringValidator()
  remarks: string
}
