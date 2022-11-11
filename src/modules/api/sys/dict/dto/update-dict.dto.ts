import { EnumValidator } from '@/common/decorators/class-validator/enum.decorator'
import { StringValidator } from '@/common/decorators/class-validator/string.decorator'
import { SysDto } from '@/common/dto/sys.dto'
import { UpdateDto } from '@/common/dto/update.dto'
import { EDictType } from '@/common/enums/sys.enum'
import { IntersectionType } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsOptional, IsString, ValidateIf } from 'class-validator'

export class UpdateDictDto extends IntersectionType(UpdateDto, SysDto) {
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
    optional: true,
    maxLength: 32,
  })
  label?: string

  @Expose()
  @IsOptional()
  @ValidateIf((val) => val.type === EDictType.DICT_ITEM)
  @IsString()
  value?: string

  @EnumValidator(EDictType, {
    optional: true,
  })
  type?: EDictType

  @StringValidator({
    optional: true,
  })
  remarks?: string
}
