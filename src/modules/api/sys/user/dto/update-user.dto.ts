import { BIRTH_DATE_TEMPLATE } from '@/core/constants/sys'
import { DateStringValidator } from '@/core/decorators/class-validator/date-string.decorator'
import { NumberValidator } from '@/core/decorators/class-validator/number.decorator'
import { StringValidator } from '@/core/decorators/class-validator/string.decorator'
import { UpdateDto } from '@/core/dto/update.dto'

export class UpdateUserDto extends UpdateDto {
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
