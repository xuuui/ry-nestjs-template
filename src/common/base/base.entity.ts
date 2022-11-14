import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { DateStringValidator } from '../decorators/class-validator/date-string.decorator'
import { StringValidator } from '../decorators/class-validator/string.decorator'

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @StringValidator()
  id: string

  @CreateDateColumn({
    nullable: true,
    type: 'datetime',
    comment: '创建时间',
  })
  @DateStringValidator()
  createdAt: string

  @UpdateDateColumn({
    nullable: true,
    type: 'datetime',
    comment: '更新时间',
  })
  @DateStringValidator()
  updatedAt: string

  @DeleteDateColumn({
    nullable: true,
    type: 'datetime',
    comment: '删除时间',
  })
  @DateStringValidator()
  deletedAt: string
}
