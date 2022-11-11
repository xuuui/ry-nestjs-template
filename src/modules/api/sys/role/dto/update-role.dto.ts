import { StringValidator } from '@/common/decorators/class-validator/string.decorator'
import { SysDto } from '@/common/dto/sys.dto'
import { UpdateDto } from '@/common/dto/update.dto'
import { IntersectionType } from '@nestjs/swagger'

export class UpdateRoleDto extends IntersectionType(UpdateDto, SysDto) {
  @StringValidator({
    optional: true,
    maxLength: 32,
  })
  name?: string

  @StringValidator({
    optional: true,
  })
  remarks?: string

  @StringValidator({
    optional: true,
    each: true,
  })
  resourceIds?: string[]
}
