import { BaseEntity } from '@/core/base/base.entity'
import { StringValidator } from '@/core/decorators/class-validator/string.decorator'
import { ForeignKeyColumn } from '@/core/decorators/typeorm/foreign-key.decorator'
import { Entity } from 'typeorm'

@Entity({ name: 'sys_role_resource' })
export class RoleResourceEntity extends BaseEntity {
  @ForeignKeyColumn({
    comment: '角色id',
  })
  @StringValidator()
  roleId: string

  @ForeignKeyColumn({
    comment: '资源id',
  })
  @StringValidator()
  resourceId: string
}
