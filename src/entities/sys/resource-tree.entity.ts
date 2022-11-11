import { BaseEntity } from '@/common/base/base.entity'
import { NumberValidator } from '@/common/decorators/class-validator/number.decorator'
import { StringValidator } from '@/common/decorators/class-validator/string.decorator'
import { Column, Entity, Index } from 'typeorm'

@Entity({ name: 'sys_resource_tree' })
export class ResourceTreeEntity extends BaseEntity {
  @Index()
  @Column({
    nullable: true,
    comment: '祖先id',
  })
  @StringValidator()
  ancestorId: string

  @Column({
    comment: '相对祖先的层级',
  })
  @NumberValidator()
  level: number

  @Index()
  @Column({
    nullable: true,
  })
  @StringValidator()
  resourceId: string
}
