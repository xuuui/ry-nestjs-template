import { ApiPaginationResponse } from '@/common/decorators/api-pagination-response.decorator'
import { JwtAuth } from '@/common/decorators/jwt-auth.decorator'
import { PaginationDto } from '@/common/dto/pagination.dto'
import { OperateLogModel } from '@/models/sys/operate-log.model'
import { Controller, Get, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ParsedQueryParams, QueryParse } from '@ry-nestjs/typeorm-query'
import { OperateLogService } from './operate-log.service'

@ApiTags('操作日志模块')
@JwtAuth()
@Controller()
export class OperateLogController {
  constructor(private readonly service: OperateLogService) {}

  @ApiOperation({ summary: '查询列表' })
  @ApiPaginationResponse(OperateLogModel)
  @Get('/queryList')
  async queryList(
    @Query(new QueryParse()) parsed: ParsedQueryParams,
  ): Promise<PaginationDto<OperateLogModel> | OperateLogModel[]> {
    return await this.service.baseQueryList(parsed)
  }
}
