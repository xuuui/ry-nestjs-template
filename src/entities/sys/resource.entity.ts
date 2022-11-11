import { BaseEntity } from '@/common/base/base.entity'
import { EnumValidator } from '@/common/decorators/class-validator/enum.decorator'
import { NumberValidator } from '@/common/decorators/class-validator/number.decorator'
import { StringValidator } from '@/common/decorators/class-validator/string.decorator'
import { EAccountType, EResourceType } from '@/common/enums/sys.enum'
import { Column, Entity, Index } from 'typeorm'

@Entity({ name: 'sys_resource' })
export class ResourceEntity extends BaseEntity {
  @Index()
  @Column({
    nullable: true,
    comment: '父级id',
  })
  @StringValidator()
  parentId: string

  @Column({
    length: 64,
    comment: '名称',
  })
  @StringValidator({
    maxLength: 64,
  })
  name: string

  @Column({
    length: 32,
    comment: '标题',
  })
  @StringValidator({
    maxLength: 32,
  })
  title: string

  @Column({
    type: 'enum',
    enum: EResourceType,
    comment: '类型: 路由 菜单 按钮',
  })
  @EnumValidator(EResourceType)
  type: EResourceType

  @Column({
    default: '',
    comment: '图标',
  })
  @StringValidator()
  icon: string

  @Column({
    default: 0,
    comment: '排序',
  })
  @NumberValidator()
  sort: number

  @Column({
    default: '',
    comment: '权限编码',
  })
  @StringValidator()
  permission: string

  @Column({
    default: '',
    comment: '路由地址',
  })
  @StringValidator()
  path: string

  @Column({
    default: '',
    comment: '组件路径',
  })
  @StringValidator()
  component: string

  @Column('tinyint', {
    default: 1,
    comment: '是否缓存',
  })
  @NumberValidator()
  isCache: number

  @Column('tinyint', {
    default: 1,
    comment: '是否显示',
  })
  @NumberValidator()
  isVisible: number

  @Column('tinyint', {
    default: 1,
    comment: '1正常 0停用',
  })
  @NumberValidator()
  state: number

  @Column({
    type: 'enum',
    enum: EAccountType,
    comment: '账户平台',
  })
  @EnumValidator(EAccountType)
  accountType: EAccountType

  @Column('tinyint', {
    default: 1,
    comment: '系统数据',
  })
  @NumberValidator()
  isSys: number
}
