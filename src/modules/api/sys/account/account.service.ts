import { AppService } from '@/app/app.service'
import { BaseService } from '@/core/base/base.service'
import { PaginationDto } from '@/core/dto/pagination.dto'
import { ValExistDto } from '@/core/dto/val-exist.dto'
import { EAccountType } from '@/core/enums/sys.enum'
import { ActionFailException } from '@/core/exceptions/action-fail.exception'
import { AccountIdentityEntity } from '@/entities/sys/account-identity.entity'
import { AccountRoleEntity } from '@/entities/sys/account-role.entity'
import { AccountEntity } from '@/entities/sys/account.entity'
import { RoleEntity } from '@/entities/sys/role.entity'
import { ThirdAuthEntity } from '@/entities/sys/third-auth.entity'
import { UserEntity } from '@/entities/sys/user.entity'
import { AccountModel } from '@/models/sys/account.model'
import { hashPassword } from '@/utils/func'
import { Injectable } from '@nestjs/common'
import { ParsedQueryParams, QueryBuilder } from '@ry-nestjs/typeorm-query'
import {
  Transaction,
  useTransaction,
} from '@ry-nestjs/typeorm-transactional-next'
import { isDate } from 'lodash'
import { DataSource, FindOptionsWhere, In, Not } from 'typeorm'
import { CreateAdminAccountDto } from './dto/create-admin-account.dto'
import { CreateClientAccountDto } from './dto/create-client-account.dto'
import { UpdateAdminAccountDto } from './dto/update-admin-account.dto'
import { UpdateClientAccountDto } from './dto/update-client-account.dto'

@Injectable()
export class AccountService extends BaseService<AccountEntity> {
  constructor(
    protected readonly dataSource: DataSource,
    private readonly app: AppService,
  ) {
    super(AccountEntity, dataSource)
  }

  async isUsernameExist(
    valExistDto: ValExistDto,
    accountType: EAccountType,
  ): Promise<boolean> {
    const { value, excludeId } = valExistDto
    const where: FindOptionsWhere<AccountEntity> = {
      username: value,
      accountType,
    }
    if (excludeId) where.id = Not(excludeId)

    return !!(await this.findOne({ where }))
  }

  async isMobileExist(
    valExistDto: ValExistDto,
    accountType: EAccountType,
  ): Promise<boolean> {
    const { value, excludeId } = valExistDto
    const where: FindOptionsWhere<AccountEntity> = {
      mobile: value,
      accountType,
    }
    if (excludeId) where.id = Not(excludeId)
    return !!(await this.findOne({ where }))
  }

  async checkUsernameExist(options: {
    username: string
    accountType: EAccountType
    excludeId?: string
  }) {
    const { username, accountType, excludeId } = options
    const isUsernameExist = await this.isUsernameExist(
      {
        value: username,
        excludeId,
      },
      accountType,
    )
    if (!!username && isUsernameExist) {
      throw new ActionFailException('用户名已存在')
    }
  }

  async checkMobileExist(options: {
    mobile: string
    accountType: EAccountType
    excludeId?: string
  }) {
    const { excludeId, mobile, accountType } = options

    const isMobileExist = await this.isMobileExist(
      {
        value: mobile,
        excludeId,
      },
      accountType,
    )

    if (!!mobile && isMobileExist) {
      throw new ActionFailException('手机号已存在')
    }
  }

  @Transaction()
  async setAccountRoles(accountId: string, roleIds: string[]) {
    const manager = useTransaction()
    await manager.softDelete(AccountRoleEntity, {
      accountId,
    })
    await manager.insert(
      AccountRoleEntity,
      roleIds.map((roleId) => ({
        accountId,
        roleId,
      })),
    )
    return true
  }

  @Transaction()
  async createAdmin(createDto: CreateAdminAccountDto): Promise<AccountModel> {
    const manager = useTransaction()
    const {
      roleIds,
      isSuperAdmin,
      user: createUserDto,
      ...createAccountDto
    } = createDto

    await this.checkUsernameExist({
      username: createAccountDto.username,
      accountType: createAccountDto.accountType,
    })
    await this.checkMobileExist({
      mobile: createAccountDto.mobile,
      accountType: createAccountDto.accountType,
    })

    // 创建账户
    const account = await manager.save(AccountEntity, {
      ...createAccountDto,
      password: hashPassword(createAccountDto.password),
    })
    // 创建账户身份
    const identity = await manager.save(AccountIdentityEntity, {
      accountId: account.id,
      isSuperAdmin: isSuperAdmin ? 1 : 0,
      isSys: createAccountDto.isSys,
    })
    // 创建用户信息
    const user = await manager.save(UserEntity, {
      accountId: account.id,
      nickname: createAccountDto.username,
      realname: createAccountDto.username,
      isSys: createAccountDto.isSys,
      ...createUserDto,
    })
    // 绑定账户角色
    if (Array.isArray(roleIds)) {
      await this.setAccountRoles(account.id, roleIds)
    }
    return {
      ...account,
      user,
      identity,
    }
  }

  @Transaction()
  async updateAdmin(updateDto: UpdateAdminAccountDto): Promise<boolean> {
    const manager = useTransaction()
    const { roleIds, id, user: updateUserDto, ...updateAccountDto } = updateDto
    const account = await manager.findOneOrFail(AccountEntity, {
      where: { id },
    })

    await this.checkMobileExist({
      mobile: updateAccountDto.mobile,
      accountType: account.accountType,
      excludeId: id,
    })

    if (updateAccountDto.password) {
      updateAccountDto.password = hashPassword(updateAccountDto.password)
      await this.app.logout(id, account.accountType)
    }

    await manager.update(AccountEntity, id, updateAccountDto)
    await manager.update(
      UserEntity,
      {
        accountId: id,
      },
      { ...updateUserDto },
    )

    // 绑定账户角色
    if (Array.isArray(roleIds)) {
      await this.setAccountRoles(account.id, roleIds)
    }
    return true
  }

  @Transaction()
  async createClient(createDto: CreateClientAccountDto): Promise<AccountModel> {
    const manager = useTransaction()
    const { username, user: createUserDto, mobile } = createDto

    await this.checkUsernameExist({
      username: username,
      accountType: EAccountType.CLIENT,
    })

    if (mobile) {
      await this.checkMobileExist({
        mobile: mobile,
        accountType: EAccountType.CLIENT,
      })
    }

    // 创建账户
    const account = await manager.save(AccountEntity, {
      username: username,
      mobile: mobile,
      accountType: EAccountType.CLIENT,
    })
    // 创建账户身份
    const identity = await manager.save(AccountIdentityEntity, {
      accountId: account.id,
    })
    // 创建用户信息
    const user = await manager.save(UserEntity, {
      accountId: account.id,
      ...createUserDto,
    })

    return {
      ...account,
      user,
      identity,
    }
  }

  @Transaction()
  async updateClient(updateDto: UpdateClientAccountDto): Promise<boolean> {
    const manager = useTransaction()
    const { id, user: updateUserDto, ...updateAccountDto } = updateDto

    const account = await manager.findOneByOrFail(AccountEntity, {
      id,
    })

    let username = ''
    if (updateAccountDto?.mobile) {
      await this.checkMobileExist({
        mobile: updateAccountDto.mobile,
        accountType: EAccountType.CLIENT,
        excludeId: id,
      })

      if (account.mobile === account.username) {
        username = updateAccountDto.mobile
      }
    }
    await manager.update(AccountEntity, id, { ...updateAccountDto, username })
    await manager.update(
      UserEntity,
      {
        accountId: id,
      },
      { ...updateUserDto },
    )

    return true
  }

  async queryList(
    parsed: ParsedQueryParams,
  ): Promise<AccountModel[] | PaginationDto<AccountModel>> {
    const builder = this.dataSource.manager
      .createQueryBuilder(AccountEntity, 'account')
      .leftJoinAndMapOne(
        'account.user',
        UserEntity,
        'user',
        'user.accountId = account.id',
      )
      .leftJoinAndMapOne(
        'account.identity',
        AccountIdentityEntity,
        'identity',
        'identity.accountId = account.id',
      )
      .leftJoin(
        AccountRoleEntity,
        'accountRole',
        'accountRole.accountId = account.id',
      )
      .leftJoinAndMapMany(
        'account.roles',
        RoleEntity,
        'role',
        'role.id = accountRole.roleId',
      )

    return await QueryBuilder.create(builder).parseQuery(parsed).paginate()
  }

  @Transaction()
  async delete(ids: string[]): Promise<boolean> {
    const manager = useTransaction()

    const accounts = await manager.findBy(AccountEntity, {
      id: In(ids),
    })
    // 删除账号
    await manager.softDelete(AccountEntity, {
      id: In(ids),
    })
    // 删除身份
    await manager.softDelete(AccountIdentityEntity, {
      accountId: In(ids),
    })
    // 删除用户
    await manager.softDelete(UserEntity, {
      accountId: In(ids),
    })
    // 删除角色
    await manager.softDelete(AccountRoleEntity, {
      accountId: In(ids),
    })
    const mobiles = accounts.map((item) => item.mobile)
    // 删除第三方
    await manager.softDelete(ThirdAuthEntity, {
      mobile: In(mobiles),
    })

    return true
  }
}
