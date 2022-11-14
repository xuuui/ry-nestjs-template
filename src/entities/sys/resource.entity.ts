import { BaseEntity } from '@/core/base/base.entity'
import { EnumValidator } from '@/core/decorators/class-validator/enum.decorator'
import { NumberValidator } from '@/core/decorators/class-validator/number.decorator'
import { StringValidator } from '@/core/decorators/class-validator/string.decorator'
import { CharColumn } from '@/core/decorators/typeorm/char.decorator'
import { EnumColumn } from '@/core/decorators/typeorm/enum.decorator'
import { ForeignKeyColumn } from '@/core/decorators/typeorm/foreign-key.decorator'
import { IntColumn } from '@/core/decorators/typeorm/int.decorator'
import { TinyintColumn } from '@/core/decorators/typeorm/tinyint.decorator'
import { EAccountType, EResourceType } from '@/core/enums/sys.enum'
import { Entity } from 'typeorm'

@Entity({ name: 'sys_resource' })
export class ResourceEntity extends BaseEntity {
  @ForeignKeyColumn({
    comment: '父级id',
  })
  @StringValidator()
  parentId: string

  @CharColumn({
    length: 64,
    comment: '名称',
  })
  @StringValidator({
    maxLength: 64,
  })
  name: string

  @CharColumn({
    length: 32,
    comment: '标题',
  })
  @StringValidator({
    maxLength: 32,
  })
  title: string

  @EnumColumn(EResourceType, {
    comment: '类型: 路由 菜单 按钮',
  })
  @EnumValidator(EResourceType)
  type: EResourceType

  @CharColumn({
    comment: '图标',
  })
  @StringValidator()
  icon: string

  @IntColumn({
    default: 0,
    comment: '排序',
  })
  @NumberValidator()
  sort: number

  @CharColumn({
    comment: '权限编码',
  })
  @StringValidator()
  permission: string

  @CharColumn({
    comment: '路由地址',
  })
  @StringValidator()
  path: string

  @CharColumn({
    comment: '组件路径',
  })
  @StringValidator()
  component: string

  @TinyintColumn({
    default: 1,
    comment: '是否缓存',
  })
  @NumberValidator()
  isCache: number

  @TinyintColumn({
    default: 1,
    comment: '是否显示',
  })
  @NumberValidator()
  isVisible: number

  @TinyintColumn({
    default: 1,
    comment: '是否停用',
  })
  @NumberValidator()
  state: number

  @EnumColumn(EAccountType, {
    comment: '账户类型',
  })
  @EnumValidator(EAccountType)
  accountType: EAccountType

  @IntColumn({
    default: 1,
    comment: '是否系统数据',
  })
  @NumberValidator()
  isSys: number
}
