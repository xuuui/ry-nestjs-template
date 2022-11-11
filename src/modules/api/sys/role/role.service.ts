import { BaseService } from '@/common/base/base.service'
import { PaginationDto } from '@/common/dto/pagination.dto'
import { ResourceEntity } from '@/entities/sys/resource.entity'
import { RoleResourceEntity } from '@/entities/sys/role-resource.entity'
import { AccountRoleEntity } from '@/entities/sys/account-role.entity'
import { RoleEntity } from '@/entities/sys/role.entity'
import { RoleModel } from '@/models/sys/role.model'
import { Injectable } from '@nestjs/common'
import { DataSource, In } from 'typeorm'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { ParsedQueryParams, QueryBuilder } from '@ry-nestjs/typeorm-query'
import {
  Transaction,
  useTransaction,
} from '@ry-nestjs/typeorm-transactional-next'

@Injectable()
export class RoleService extends BaseService<RoleEntity> {
  constructor(protected readonly dataSource: DataSource) {
    super(RoleEntity, dataSource)
  }

  async queryList(
    parsed: ParsedQueryParams,
  ): Promise<RoleModel[] | PaginationDto<RoleModel>> {
    const builder = this.dataSource.manager
      .createQueryBuilder(RoleEntity, 'role')
      .leftJoin(
        RoleResourceEntity,
        'roleResource',
        'roleResource.roleId = role.id',
      )
      .leftJoinAndMapMany(
        'role.resources',
        ResourceEntity,
        'resource',
        'resource.id = roleResource.resourceId',
      )
    return await QueryBuilder.create(builder).parseQuery(parsed).paginate()
  }

  @Transaction()
  async setResources(roleId: string, resourceIds: string[]): Promise<boolean> {
    const manager = useTransaction()
    await manager.softDelete(RoleResourceEntity, {
      roleId,
    })
    const resources = await manager.findBy(ResourceEntity, {
      id: In(resourceIds),
    })
    await manager.insert(
      RoleResourceEntity,
      resources.map((resource) => ({
        roleId,
        resourceId: resource.id,
      })),
    )
    return true
  }

  @Transaction()
  async createOne(createDto: CreateRoleDto): Promise<RoleModel> {
    const manager = useTransaction()
    const { resourceIds, ...createRoleDto } = createDto
    const role = await manager.save(RoleEntity, createRoleDto)
    if (Array.isArray(resourceIds)) {
      await this.setResources(role.id, resourceIds)
    }
    return role
  }

  @Transaction()
  async updateOne(updateDto: UpdateRoleDto): Promise<boolean> {
    const manager = useTransaction()
    const { resourceIds, id, ...updateRoleDto } = updateDto
    await manager.findOneByOrFail(RoleEntity, { id })
    await manager.update(RoleEntity, { id }, updateRoleDto)
    if (Array.isArray(resourceIds)) {
      await this.setResources(id, resourceIds)
    }
    return true
  }

  @Transaction()
  async delete(ids: string[]): Promise<boolean> {
    const manager = useTransaction()
    await manager.softDelete(RoleEntity, {
      id: In(ids),
    })
    await manager.softDelete(RoleResourceEntity, {
      roleId: In(ids),
    })
    await manager.softDelete(AccountRoleEntity, {
      roleId: In(ids),
    })
    return true
  }
}
