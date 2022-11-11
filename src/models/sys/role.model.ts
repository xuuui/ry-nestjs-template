import { NestedValidator } from '@/common/decorators/class-validator/nested.decorator'
import { RoleEntity } from '@/entities/sys/role.entity'
import { ResourceModel } from './resource.model'

export class RoleModel extends RoleEntity {
  @NestedValidator(ResourceModel, {
    optional: true,
    each: true,
  })
  resources?: ResourceModel[]
}
