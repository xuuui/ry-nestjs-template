import { BaseService } from '@/common/base/base.service'
import {
  EAccountType,
  EResourcePermission,
  EResourceType,
} from '@/common/enums/sys.enum'
import { ActionFailException } from '@/common/exceptions/action-fail.exception'
import { ValExistDto } from '@/common/dto/val-exist.dto'
import { Injectable } from '@nestjs/common'
import { FindOptionsWhere, DataSource, In, Not } from 'typeorm'
import { ResourceEntity } from '@/entities/sys/resource.entity'
import { ResourceModel } from '@/models/sys/resource.model'
import { AccountEntity } from '@/entities/sys/account.entity'
import { RoleResourceEntity } from '@/entities/sys/role-resource.entity'
import { AccountIdentityEntity } from '@/entities/sys/account-identity.entity'
import { AccountModel } from '@/models/sys/account.model'
import { AccountRoleEntity } from '@/entities/sys/account-role.entity'
import { CreateResourceDto } from './dto/create-resource.dto'
import { ResourceTreeEntity } from '@/entities/sys/resource-tree.entity'
import { UpdateResourceDto } from './dto/update-resource.dto'
import {
  Transaction,
  useTransaction,
} from '@ry-nestjs/typeorm-transactional-next'

@Injectable()
export class ResourceService extends BaseService<ResourceEntity> {
  constructor(protected readonly dataSource: DataSource) {
    super(ResourceEntity, dataSource)
  }

  generateTree(
    resources: ResourceModel[],
    rootId: string = null,
  ): ResourceModel[] {
    const result: ResourceModel[] = []
    const map: Map<string, ResourceModel> = new Map()
    resources.forEach((item) => map.set(item.id, item))
    map.forEach((item) => {
      if ((rootId && item.parentId === rootId) || item.parentId == null) {
        result.push(item)
      } else if (map.has(item.parentId)) {
        const parent = map.get(item.parentId)
        if (!Array.isArray(parent.children)) parent.children = []
        parent.children.push(item)
      }
    })
    return result
  }

  async getResources({
    accountId,
    accountType,
  }: {
    accountId?: string
    accountType?: EAccountType
  }): Promise<ResourceEntity[]> {
    const where: FindOptionsWhere<ResourceEntity> = {}
    if (accountType) where.accountType = accountType
    if (!accountId) {
      return await this.find({
        where,
        order: {
          sort: 'ASC',
        },
      })
    }
    const account: AccountModel = await this.dataSource.manager
      .createQueryBuilder(AccountEntity, 'account')
      .leftJoinAndMapOne(
        'account.identity',
        AccountIdentityEntity,
        'accountIdentity',
        'accountIdentity.accountId = account.id',
      )
      .where({
        id: accountId,
      })
      .getOne()
    if (account.identity.isSuperAdmin) {
      return await this.find({
        where,
        order: {
          sort: 'ASC',
        },
      })
    }
    const roleIds = (
      await this.dataSource.manager.find(AccountRoleEntity, {
        select: ['roleId'],
        where: {
          accountId,
        },
      })
    ).map((item) => item.roleId)
    if (roleIds.length === 0) return []
    const resourceIds = (
      await this.dataSource.manager.find(RoleResourceEntity, {
        select: ['resourceId'],
        where: {
          roleId: In(roleIds),
        },
      })
    ).map((item) => item.resourceId)
    const resources = await this.find({
      where: {
        id: In(resourceIds),
        ...where,
      },
      order: {
        sort: 'ASC',
      },
    })
    return resources
  }

  async getPermCodeList(accountId: string): Promise<string[]> {
    const resources = await this.getResources({ accountId })
    return resources
      .filter((item) => item.type === EResourceType.BUTTON)
      .map((item) => item.permission)
  }

  async getMenuTree(accountId: string): Promise<ResourceModel[]> {
    const account = await this.dataSource.manager
      .createQueryBuilder(AccountEntity, 'account')
      .where({ id: accountId })
      .getOne()
    const resources = this.generateTree(
      (
        await this.getResources({ accountId, accountType: account.accountType })
      ).filter((item) => item.type !== EResourceType.BUTTON),
    )
    return resources
  }

  async getResourceTree({
    accountId,
    accountType,
  }: {
    accountId?: string
    accountType?: EAccountType
  }): Promise<ResourceModel[]> {
    const resources = this.generateTree(
      await this.getResources({ accountId, accountType }),
    )
    return resources
  }

  async isPathExist(
    valExistDto: ValExistDto,
    accountType: EAccountType,
  ): Promise<Boolean> {
    const { value, excludeId } = valExistDto
    const where: FindOptionsWhere<ResourceEntity> = {
      path: value,
      accountType,
    }
    if (excludeId) where.id = Not(excludeId)

    return !!(await this.findOne({ where }))
  }

  async isNameExist(
    valExistDto: ValExistDto,
    accountType: EAccountType,
  ): Promise<Boolean> {
    const { value, excludeId } = valExistDto
    const where: FindOptionsWhere<ResourceEntity> = {
      name: value,
      accountType,
    }
    if (excludeId) where.id = Not(excludeId)

    return !!(await this.findOne({ where }))
  }

  @Transaction()
  async createOne(createDto: CreateResourceDto): Promise<ResourceModel> {
    const manager = useTransaction()

    if (
      createDto.name &&
      (await this.isNameExist(
        {
          value: createDto.name,
        },
        createDto.accountType,
      ))
    ) {
      throw new ActionFailException('名称已存在')
    }

    if (
      createDto.path &&
      (await this.isPathExist(
        {
          value: createDto.path,
        },
        createDto.accountType,
      ))
    ) {
      throw new ActionFailException('路由地址已存在')
    }
    const resource = await manager.save(ResourceEntity, createDto)
    // 创建层级
    await this.insertTree(resource.id, resource.parentId)

    if (resource.type === EResourceType.MENU && resource.component) {
      for (let key in EResourcePermission) {
        await this.createOne({
          title: EResourcePermission[key] + resource.title,
          type: EResourceType.BUTTON,
          name: resource.name + ':' + key,
          permission: resource.name + ':' + key,
          parentId: resource.id,
          isSys: 1,
          accountType: resource.accountType,
        })
      }
    }

    return resource
  }

  @Transaction()
  async updateOne(updateDto: UpdateResourceDto): Promise<boolean> {
    const manager = useTransaction()
    const { id, ...update } = updateDto
    let resource = await manager.findOneOrFail(ResourceEntity, {
      where: { id },
    })
    if (
      update.name &&
      (await this.isNameExist(
        {
          value: updateDto.name,
          excludeId: id,
        },
        resource.accountType,
      ))
    ) {
      throw new ActionFailException('路由名称已存在')
    }
    if (
      update.path &&
      (await this.isPathExist(
        {
          value: updateDto.path,
          excludeId: id,
        },
        resource.accountType,
      ))
    ) {
      throw new ActionFailException('路由地址已存在')
    }
    await manager.update(ResourceEntity, id, update)
    resource = await manager.findOne(ResourceEntity, { where: { id } })
    // 删除旧的层级再创建新的层级
    await manager.delete(ResourceTreeEntity, { resourceId: resource.id })
    await this.insertTree(resource.id, resource.parentId)
    return true
  }

  @Transaction()
  async delete(ids: string[]): Promise<boolean> {
    const manager = useTransaction()
    let allIds = []
    for (const id of ids) {
      const list = await manager.find(ResourceTreeEntity, {
        select: ['resourceId'],
        where: { ancestorId: id },
      })
      list.forEach((item) => {
        if (!allIds.includes(item.resourceId)) {
          allIds.push(item.resourceId)
        }
      })
    }
    // 删除资源
    await manager.delete(ResourceEntity, allIds)
    // 删除资源树
    await manager.delete(ResourceTreeEntity, {
      ancestorId: In(allIds),
    })
    // 删除角色资源
    await manager.delete(RoleResourceEntity, {
      resourceId: In(allIds),
    })
    return true
  }

  @Transaction()
  async insertTree(
    resourceId: string,
    parentId: string = null,
  ): Promise<Boolean> {
    const manager = useTransaction()

    // 创建自身层级
    await manager.save(ResourceTreeEntity, {
      resourceId,
      level: 0,
      ancestorId: resourceId,
    })

    if (parentId) {
      const list = await manager.find(ResourceTreeEntity, {
        where: {
          resourceId: parentId,
        },
      })
      const insertList = list.map((item) => ({
        resourceId,
        level: item.level + 1,
        ancestorId: item.ancestorId,
      }))

      await manager.insert(ResourceTreeEntity, insertList)
    }
    return true
  }
}
