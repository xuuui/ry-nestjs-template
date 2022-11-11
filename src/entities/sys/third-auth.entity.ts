import { BaseEntity } from '@/common/base/base.entity'
import { EnumValidator } from '@/common/decorators/class-validator/enum.decorator'
import { StringValidator } from '@/common/decorators/class-validator/string.decorator'
import { EThirdPlatform } from '@/common/enums/sys.enum'
import { Expose } from 'class-transformer'
import { IsEnum, IsString, MaxLength } from 'class-validator'
import { Column, Entity, Index } from 'typeorm'

@Entity({ name: 'sys_third_auth' })
export class ThirdAuthEntity extends BaseEntity {
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

  @Index()
  @Column({ length: 256, comment: 'thirdId' })
  @StringValidator({
    maxLength: 256,
  })
  thirdId: string

  @Index()
  @Column({ nullable: true, length: 256, comment: 'unionid' })
  @StringValidator({
    maxLength: 256,
  })
  unionid: string

  @Column({
    type: 'enum',
    enum: EThirdPlatform,
    comment: '第三方平台',
  })
  @EnumValidator(EThirdPlatform)
  thirdPlatform: EThirdPlatform
}
