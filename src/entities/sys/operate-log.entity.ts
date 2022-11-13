import { BaseEntity } from '@/common/base/base.entity'
import { DateStringValidator } from '@/common/decorators/class-validator/date-string.decorator'
import { EnumValidator } from '@/common/decorators/class-validator/enum.decorator'
import { NestedValidator } from '@/common/decorators/class-validator/nested.decorator'
import { NumberValidator } from '@/common/decorators/class-validator/number.decorator'
import { StringValidator } from '@/common/decorators/class-validator/string.decorator'
import { JsonColumn } from '@/common/decorators/typeorm/JsonColumn.decorator'
import { EAccountType, EOpertateType } from '@/common/enums/sys.enum'
import { datetimeTransformer } from '@/utils/typeorm'
import { Column, Entity, Index } from 'typeorm'

@Entity({ name: 'sys_opertate_log' })
export class OperateLogEntity extends BaseEntity {
  @Column({
    type: 'enum',
    enum: EOpertateType,
    comment: '操作类型',
  })
  @EnumValidator(EOpertateType)
  operateType: EOpertateType

  @Index()
  @Column({
    comment: '操作账户id',
  })
  @StringValidator()
  operateId: string

  @Index()
  @Column({
    length: 64,
    comment: '操作账户用户名',
  })
  @StringValidator({
    maxLength: 64,
  })
  operateUsername: string

  @Column({
    comment: '操作ip',
  })
  @StringValidator()
  operateIp: string

  @Column({
    comment: '操作ip地址',
  })
  @StringValidator()
  operateIpAddress: string

  @JsonColumn({
    comment: '请求query',
  })
  @NestedValidator(Object)
  reqQuery: object

  @JsonColumn({
    comment: '请求body',
  })
  @NestedValidator(Object)
  reqBody: object

  @Column({
    comment: '接口路径',
  })
  @StringValidator()
  apiPath: string

  @Column('datetime', {
    comment: '操作时间',
    transformer: datetimeTransformer(),
  })
  @DateStringValidator()
  operateTime: string

  @Column({
    comment: '操作描述',
  })
  @StringValidator()
  operateDesc: string

  @Column('tinyint', {
    default: 1,
    comment: '操作结果 1成功 0失败',
  })
  @NumberValidator()
  state: number

  @Column('longtext', {
    comment: '异常信息',
  })
  @StringValidator()
  errMsg: string

  @Column({
    type: 'enum',
    enum: EAccountType,
    comment: '账户类型',
  })
  @EnumValidator(EAccountType)
  accountType: EAccountType
}
