import { ApiPaginationResponse } from '@/core/decorators/api-pagination-response.decorator'
import { JwtAuth } from '@/core/decorators/jwt-auth.decorator'
import { OperateLog } from '@/core/decorators/operate-log.decorator'
import { PaginationDto } from '@/core/dto/pagination.dto'
import { EOpertateType } from '@/core/enums/sys.enum'
import { ToArrayPipe } from '@/core/pipes/to-array.pipe'
import { AccountModel } from '@/models/sys/account.model'
import { Body, Controller, Delete, Get, Post, Put, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ParsedQueryParams, QueryParse } from '@ry-nestjs/typeorm-query'
import { AccountService } from './account.service'
import { CreateAdminAccountDto } from './dto/create-admin-account.dto'
import { CreateClientAccountDto } from './dto/create-client-account.dto'
import { UpdateAdminAccountDto } from './dto/update-admin-account.dto'
import { UpdateClientAccountDto } from './dto/update-client-account.dto'

@ApiTags('账户模块')
@JwtAuth()
@Controller()
export class AccountController {
  constructor(private readonly service: AccountService) {}

  @ApiOperation({ summary: '查询列表' })
  @ApiPaginationResponse(AccountModel)
  @OperateLog({
    type: EOpertateType.VIEW,
    desc: (req) => {
      let key = ''
      if (req.query.s) {
        key = JSON.parse(req.query.s as string).accountType
      }
      return `查询${key}账户列表`
    },
  })
  @Get('/queryList')
  async queryList(
    @Query(new QueryParse()) parsed: ParsedQueryParams,
  ): Promise<PaginationDto<AccountModel> | AccountModel[]> {
    return await this.service.queryList(parsed)
  }

  @ApiOperation({ summary: '创建管理员' })
  @OperateLog({
    type: EOpertateType.ADD,
    desc: (req) => {
      const { accountType } = req.body
      return `创建${accountType}账户`
    },
  })
  @Post('/createAdmin')
  async createAdmin(
    @Body() createDto: CreateAdminAccountDto,
  ): Promise<AccountModel> {
    return await this.service.createAdmin(createDto)
  }

  @ApiOperation({ summary: '更新管理员' })
  @OperateLog({
    type: EOpertateType.EDIT,
    desc: (req) => {
      const { accountType } = req.body
      return `编辑${accountType}账户`
    },
  })
  @Put('/updateAdmin')
  async updateAdmin(
    @Body() updateDto: UpdateAdminAccountDto,
  ): Promise<boolean> {
    return await this.service.updateAdmin(updateDto)
  }

  @ApiOperation({ summary: '创建用户' })
  @OperateLog({
    type: EOpertateType.ADD,
    desc: '创建会员账户',
  })
  @Post('/createClient')
  async createClient(
    @Body() createDto: CreateClientAccountDto,
  ): Promise<AccountModel> {
    return await this.service.createClient(createDto)
  }

  @ApiOperation({ summary: '更新用户' })
  @OperateLog({
    type: EOpertateType.EDIT,
    desc: '编辑会员账户',
  })
  @Put('/updateClient')
  async updateClient(
    @Body() updateDto: UpdateClientAccountDto,
  ): Promise<boolean> {
    return await this.service.updateClient(updateDto)
  }

  @ApiOperation({ summary: '删除' })
  @OperateLog({
    type: EOpertateType.DEL,
    desc: (req) => {
      let key = ''
      if (req.query.s) {
        key = JSON.parse(req.query.s as string).accountType
      }
      return `删除${key}账户`
    },
  })
  @Delete('/delete')
  async delete(
    @Query('id', new ToArrayPipe()) ids: string[],
  ): Promise<boolean> {
    return await this.service.delete(ids)
  }
}
