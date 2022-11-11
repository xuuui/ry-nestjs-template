import { ApiPaginationResponse } from '@/common/decorators/api-pagination-response.decorator'
import { JwtAuth } from '@/common/decorators/jwt-auth.decorator'
import { OperateLog } from '@/common/decorators/operate-log.decorator'
import { PaginationDto } from '@/common/dto/pagination.dto'
import { EOpertateType } from '@/common/enums/sys.enum'
import { ToArrayPipe } from '@/common/pipes/to-array.pipe'
import { RoleModel } from '@/models/sys/role.model'
import { Body, Controller, Delete, Get, Post, Put, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ParsedQueryParams, QueryParse } from '@ry-nestjs/typeorm-query'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { RoleService } from './role.service'

@ApiTags('角色模块')
@JwtAuth()
@Controller()
export class RoleController {
  constructor(private readonly service: RoleService) {}

  @ApiOperation({ summary: '查询列表' })
  @ApiPaginationResponse(RoleModel)
  @OperateLog({
    type: EOpertateType.VIEW,
    desc: '查询角色列表',
  })
  @Get('/queryList')
  async queryList(
    @Query(new QueryParse()) parsed: ParsedQueryParams,
  ): Promise<PaginationDto<RoleModel> | RoleModel[]> {
    return await this.service.queryList(parsed)
  }

  @ApiOperation({ summary: '创建' })
  @OperateLog({
    type: EOpertateType.ADD,
    desc: '创建角色',
  })
  @Post('/createOne')
  async createOne(@Body() createDto: CreateRoleDto): Promise<RoleModel> {
    return await this.service.createOne(createDto)
  }

  @ApiOperation({ summary: '更新' })
  @OperateLog({
    type: EOpertateType.EDIT,
    desc: '更新角色',
  })
  @Put('/updateOne')
  async updateOne(@Body() updateDto: UpdateRoleDto): Promise<boolean> {
    return await this.service.updateOne(updateDto)
  }

  @ApiOperation({ summary: '删除' })
  @OperateLog({
    type: EOpertateType.DEL,
    desc: '删除角色',
  })
  @Delete('/delete')
  async delete(
    @Query('id', new ToArrayPipe()) ids: string[],
  ): Promise<boolean> {
    return await this.service.delete(ids)
  }
}
