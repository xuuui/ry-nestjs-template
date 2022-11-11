import { BaseEntity } from '@/common/base/base.entity'
import { StringValidator } from '@/common/decorators/class-validator/string.decorator'
import { Column, Entity, Index } from 'typeorm'

@Entity({ name: 'sys_role_resource' })
export class RoleResourceEntity extends BaseEntity {
  @Index()
  @Column({
    comment: '角色id',
  })
  @StringValidator()
  roleId: string

  @Index()
  @Column({
    comment: '资源id',
  })
  @StringValidator()
  resourceId: string
}
