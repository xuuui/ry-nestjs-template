import { BaseEntity } from '@/core/base/base.entity'
import { DateStringValidator } from '@/core/decorators/class-validator/date-string.decorator'
import { EnumValidator } from '@/core/decorators/class-validator/enum.decorator'
import { NestedValidator } from '@/core/decorators/class-validator/nested.decorator'
import { NumberValidator } from '@/core/decorators/class-validator/number.decorator'
import { StringValidator } from '@/core/decorators/class-validator/string.decorator'
import { CharColumn } from '@/core/decorators/typeorm/char.decorator'
import { DatetimeColumn } from '@/core/decorators/typeorm/datetime.decorator'
import { EnumColumn } from '@/core/decorators/typeorm/enum.decorator'
import { ForeignKeyColumn } from '@/core/decorators/typeorm/foreign-key.decorator'
import { JsonColumn } from '@/core/decorators/typeorm/json.decorator'
import { LongtextColumn } from '@/core/decorators/typeorm/longtext.decorator'
import { TinyintColumn } from '@/core/decorators/typeorm/tinyint.decorator'
import { EAccountType, EOpertateType } from '@/core/enums/sys.enum'
import { Entity, Index } from 'typeorm'

@Entity({ name: 'sys_opertate_log' })
export class OperateLogEntity extends BaseEntity {
  @EnumColumn(EOpertateType, {
    comment: '操作类型',
  })
  @EnumValidator(EOpertateType)
  operateType: EOpertateType

  @ForeignKeyColumn({
    comment: '操作账户id',
  })
  @StringValidator()
  operateId: string

  @Index()
  @CharColumn({
    length: 64,
    comment: '操作账户用户名',
  })
  @StringValidator({
    maxLength: 64,
  })
  operateUsername: string

  @CharColumn({
    comment: 'ip',
  })
  @StringValidator()
  operateIp: string

  @CharColumn({
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

  @CharColumn({
    comment: '接口路径',
  })
  @StringValidator()
  apiPath: string

  @DatetimeColumn({
    comment: '操作时间',
  })
  @DateStringValidator()
  operateTime: string

  @CharColumn({
    comment: '操作描述',
  })
  @StringValidator()
  operateDesc: string

  @TinyintColumn({
    default: 1,
    comment: '操作结果 1成功 0失败',
  })
  @NumberValidator()
  state: number

  @LongtextColumn({
    comment: '异常信息',
  })
  @StringValidator()
  errMsg: string

  @EnumColumn(EAccountType, {
    comment: '账户类型',
  })
  @EnumValidator(EAccountType)
  accountType: EAccountType
}
