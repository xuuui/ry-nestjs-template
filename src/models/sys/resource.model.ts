import { BooleanValidator } from '@/common/decorators/class-validator/boolean.decorator'
import { NestedValidator } from '@/common/decorators/class-validator/nested.decorator'
import { ResourceEntity } from '@/entities/sys/resource.entity'

export class ResourceModel extends ResourceEntity {
  @NestedValidator(ResourceModel, {
    optional: true,
    each: true,
  })
  children?: ResourceModel[]
}
