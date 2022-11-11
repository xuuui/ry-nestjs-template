import { ApiPaginationResponse } from '@/common/decorators/api-pagination-response.decorator'
import { JwtAuth, NoJwtAuth } from '@/common/decorators/jwt-auth.decorator'
import { OperateLog } from '@/common/decorators/operate-log.decorator'
import { PaginationDto } from '@/common/dto/pagination.dto'
import { EOpertateType } from '@/common/enums/sys.enum'
import { ToArrayPipe } from '@/common/pipes/to-array.pipe'
import { DictModel } from '@/models/sys/dict.model'
import { Body, Controller, Delete, Get, Post, Put, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ParsedQueryParams, QueryParse } from '@ry-nestjs/typeorm-query'
import { DictService } from './dict.service'
import { CreateDictDto } from './dto/create-dict.dto'
import { UpdateDictDto } from './dto/update-dict.dto'

@ApiTags('字典模块')
@JwtAuth()
@Controller()
export class DictController {
  constructor(private readonly service: DictService) {}

  @ApiOperation({ summary: '获取所有字典' })
  @NoJwtAuth()
  @Get('/getMap')
  async getMap(): Promise<Mapable<DictModel>> {
    return await this.service.getMap()
  }

  @ApiOperation({ summary: '根据code查询字典项' })
  @Get('/getItemsByCode')
  async getItemsByCode(@Query('code') code: string) {
    return await this.service.getItemsByCode(code)
  }

  @ApiOperation({ summary: '查询列表' })
  @ApiPaginationResponse(DictModel)
  @OperateLog({
    type: EOpertateType.VIEW,
    desc: '查询字典列表',
  })
  @Get('/queryList')
  async queryList(
    @Query(new QueryParse()) parsed: ParsedQueryParams,
  ): Promise<PaginationDto<DictModel> | DictModel[]> {
    return await this.service.baseQueryList(parsed)
  }

  @ApiOperation({ summary: '创建' })
  @OperateLog({
    type: EOpertateType.ADD,
    desc: '创建字典',
  })
  @Post('/createOne')
  async createOne(@Body() createDto: CreateDictDto): Promise<DictModel> {
    return await this.service.createOne(createDto)
  }

  @ApiOperation({ summary: '更新' })
  @OperateLog({
    type: EOpertateType.EDIT,
    desc: '编辑字典',
  })
  @Put('/updateOne')
  async updateOne(@Body() updateDto: UpdateDictDto): Promise<boolean> {
    return await this.service.updateOne(updateDto)
  }

  @ApiOperation({ summary: '删除' })
  @OperateLog({
    type: EOpertateType.DEL,
    desc: '删除字典',
  })
  @Delete('/delete')
  async delete(
    @Query('id', new ToArrayPipe()) ids: string[],
  ): Promise<boolean> {
    return await this.service.delete(ids)
  }
}
