import { BaseService } from '@/core/base/base.service'
import {
  EAccountType,
  EResourcePermissionLabel,
  EResourceType,
} from '@/core/enums/sys.enum'
import { ActionFailException } from '@/core/exceptions/action-fail.exception'
import { ValExistDto } from '@/core/dto/val-exist.dto'
import { Injectable } from '@nestjs/common'
import {
  FindOptionsWhere,
  DataSource,
  In,
  Not,
  FindOptionsOrder,
} from 'typeorm'
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
import { lowerCase } from 'change-case-all'
import { toCamelCase } from '@/utils/func'

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

  async getResources(
    accountId?: string,
    accountType?: EAccountType,
  ): Promise<ResourceEntity[]> {
    const where: FindOptionsWhere<ResourceEntity> = {}
    const order: FindOptionsOrder<ResourceEntity> = { sort: 'ASC' }
    if (accountType) where.accountType = accountType
    if (!accountId) {
      return await this.find({
        where,
        order,
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
        order,
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
      order,
    })
    return resources
  }

  async getPermCodeList(
    accountId: string,
    accountType: EAccountType,
  ): Promise<string[]> {
    const resources = await this.getResources(accountId, accountType)
    return resources
      .filter((item) => item.type === EResourceType.BUTTON)
      .map((item) => item.permission)
  }

  async getMenuTree(
    accountId: string,
    accountType: EAccountType,
  ): Promise<ResourceModel[]> {
    const resources = this.generateTree(
      (await this.getResources(accountId, accountType)).filter(
        (item) => item.type !== EResourceType.BUTTON,
      ),
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
      await this.getResources(accountId, accountType),
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
      throw new ActionFailException('???????????????')
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
      throw new ActionFailException('?????????????????????')
    }
    const resource = await manager.save(ResourceEntity, createDto)
    // ????????????
    await this.insertTree(resource.id, resource.parentId)

    if (resource.type === EResourceType.MENU && resource.component) {
      for (let key in EResourcePermissionLabel) {
        await this.createOne({
          title: EResourcePermissionLabel[key] + resource.title,
          type: EResourceType.BUTTON,
          name: resource.name + toCamelCase(lowerCase(key)),
          permission: resource.name + ':' + key,
          parentId: resource.id,
          isSys: createDto.isSys,
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
      throw new ActionFailException('?????????????????????')
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
      throw new ActionFailException('?????????????????????')
    }
    await manager.update(ResourceEntity, id, update)
    resource = await manager.findOne(ResourceEntity, { where: { id } })
    // ???????????????????????????????????????
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
    // ????????????
    await manager.delete(ResourceEntity, allIds)
    // ???????????????
    await manager.delete(ResourceTreeEntity, {
      ancestorId: In(allIds),
    })
    // ??????????????????
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

    // ??????????????????
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
