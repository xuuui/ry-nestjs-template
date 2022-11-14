import { BaseEntity } from '@/common/base/base.entity'
import { EnumValidator } from '@/common/decorators/class-validator/enum.decorator'
import { StringValidator } from '@/common/decorators/class-validator/string.decorator'
import { CharColumn } from '@/common/decorators/typeorm/char.decorator'
import { EnumColumn } from '@/common/decorators/typeorm/enum.decorator'
import { EThirdPlatform } from '@/common/enums/sys.enum'
import { Entity, Index } from 'typeorm'

@Entity({ name: 'sys_third_auth' })
export class ThirdAuthEntity extends BaseEntity {
  @Index()
  @CharColumn({
    length: 20,
    comment: '手机号',
  })
  @StringValidator({
    maxLength: 20,
  })
  mobile: string

  @Index()
  @CharColumn({
    length: 256,
    comment: 'thirdId',
  })
  @StringValidator({
    maxLength: 256,
  })
  thirdId: string

  @Index()
  @CharColumn({
    length: 256,
    comment: 'unionid',
  })
  @StringValidator({
    maxLength: 256,
  })
  unionid: string

  @EnumColumn(EThirdPlatform, {
    comment: '第三方平台',
  })
  @EnumValidator(EThirdPlatform)
  thirdPlatform: EThirdPlatform
}
