import { BaseEntity } from '@/core/base/base.entity'
import { NumberValidator } from '@/core/decorators/class-validator/number.decorator'
import { StringValidator } from '@/core/decorators/class-validator/string.decorator'
import { ForeignKeyColumn } from '@/core/decorators/typeorm/foreign-key.decorator'
import { IntColumn } from '@/core/decorators/typeorm/int.decorator'
import { Entity } from 'typeorm'

@Entity({ name: 'sys_resource_tree' })
export class ResourceTreeEntity extends BaseEntity {
  @ForeignKeyColumn({
    comment: '祖先id',
  })
  @StringValidator()
  ancestorId: string

  @IntColumn({
    comment: '相对祖先的层级',
  })
  @NumberValidator()
  level: number

  @ForeignKeyColumn({
    comment: '当前资源id',
  })
  @StringValidator()
  resourceId: string
}
