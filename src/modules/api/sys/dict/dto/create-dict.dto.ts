import { EDictType } from '@/core/enums/sys.enum'
import { SysDto } from '@/core/dto/sys.dto'
import { IsOptional, IsString, ValidateIf } from 'class-validator'
import { Expose } from 'class-transformer'
import { StringValidator } from '@/core/decorators/class-validator/string.decorator'
import { EnumValidator } from '@/core/decorators/class-validator/enum.decorator'

export class CreateDictDto extends SysDto {
  @StringValidator({
    optional: true,
  })
  parentId?: string

  @Expose()
  @IsOptional()
  @ValidateIf((val) => val.type === EDictType.DICT)
  @IsString()
  code?: string

  @StringValidator({
    maxLength: 32,
  })
  label: string

  @Expose()
  @IsOptional()
  @ValidateIf((val) => val.type === EDictType.DICT_ITEM)
  @IsString()
  value?: string

  @EnumValidator(EDictType)
  type: EDictType

  @StringValidator({
    optional: true,
  })
  remarks?: string
}
