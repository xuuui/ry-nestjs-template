import { dateFormat } from '@/utils/func'
import { Expose, Transform } from 'class-transformer'
import { IsDateString } from 'class-validator'
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

export abstract class BaseEntity {
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn({
    nullable: true,
    type: 'datetime',
    comment: '创建时间',
  })
  @Expose()
  @Transform(({ value }) => dateFormat(value))
  @IsDateString()
  createdAt: string

  @UpdateDateColumn({
    nullable: true,
    type: 'datetime',
    comment: '更新时间',
  })
  @Expose()
  @Transform(({ value }) => dateFormat(value))
  @IsDateString()
  updatedAt: string

  @DeleteDateColumn({
    nullable: true,
    type: 'datetime',
    comment: '删除时间',
  })
  @Expose()
  @Transform(({ value }) => dateFormat(value))
  @IsDateString()
  deletedAt: string
}
