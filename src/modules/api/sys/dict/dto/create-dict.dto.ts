import { EDictType } from '@/common/enums/sys.enum'
import { SysDto } from '@/common/dto/sys.dto'
import { IsOptional, IsString, ValidateIf } from 'class-validator'
import { Expose } from 'class-transformer'
import { StringValidator } from '@/common/decorators/class-validator/string.decorator'
import { EnumValidator } from '@/common/decorators/class-validator/enum.decorator'

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
