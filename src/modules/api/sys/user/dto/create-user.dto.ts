import { BIRTH_DATE_TEMPLATE } from '@/common/constants/sys'
import { DateStringValidator } from '@/common/decorators/class-validator/date-string.decorator'
import { NumberValidator } from '@/common/decorators/class-validator/number.decorator'
import { StringValidator } from '@/common/decorators/class-validator/string.decorator'

export class CreateUserDto {
  @StringValidator()
  accountId: string

  @StringValidator({
    optional: true,
  })
  nickname?: string

  @StringValidator({
    optional: true,
  })
  avatar?: string

  @StringValidator({
    optional: true,
    maxLength: 128,
  })
  realname?: string

  @NumberValidator({
    optional: true,
  })
  sex?: number

  @DateStringValidator({
    optional: true,
    format: BIRTH_DATE_TEMPLATE,
  })
  birthDate?: string

  @NumberValidator({
    optional: true,
  })
  age?: number

  @StringValidator({
    optional: true,
  })
  remarks?: string
}
