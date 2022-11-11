import { BooleanValidator } from '@/common/decorators/class-validator/boolean.decorator'
import { NestedValidator } from '@/common/decorators/class-validator/nested.decorator'
import { ResourceEntity } from '@/entities/sys/resource.entity'
import { Expose, Type } from 'class-transformer'
import { IsBoolean, IsOptional, ValidateNested } from 'class-validator'

export class ResourceModel extends ResourceEntity {
  @BooleanValidator({
    optional: true,
  })
  hasChildren?: boolean

  @NestedValidator(ResourceModel, {
    optional: true,
    each: true,
  })
  children?: ResourceModel[]
}
