import { AppService } from '@/app/app.service'
import { JwtAuth } from '@/common/decorators/jwt-auth.decorator'
import { OperateLog } from '@/common/decorators/operate-log.decorator'
import { EAccountType, EOpertateType } from '@/common/enums/sys.enum'
import { ToArrayPipe } from '@/common/pipes/to-array.pipe'
import { ResourceModel } from '@/models/sys/resource.model'
import { Body, Controller, Delete, Get, Post, Put, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { CreateResourceDto } from './dto/create-resource.dto'
import { UpdateResourceDto } from './dto/update-resource.dto'
import { ResourceService } from './resource.service'

@ApiTags('资源模块')
@JwtAuth()
@Controller()
export class ResourceController {
  constructor(
    private readonly service: ResourceService,
    private readonly app: AppService,
  ) {}

  @ApiOperation({ summary: '获取当前用户菜单列表' })
  @Get('/getMenuTree')
  async getMenuTree(): Promise<ResourceModel[]> {
    const { accountId, accountType } = this.app.getAuthInfo()
    return await this.service.getMenuTree(accountId, accountType)
  }

  @ApiOperation({ summary: '获取当前用户资源列表' })
  @OperateLog({
    type: EOpertateType.VIEW,
    desc: '查询资源列表',
  })
  @Get('/getResourceTree')
  async getResourceTree(
    @Query('accountId') accountId?: string,
    @Query('accountType') accountType?: EAccountType,
  ): Promise<ResourceModel[]> {
    return await this.service.getResourceTree({ accountId, accountType })
  }

  @ApiOperation({ summary: '获取当前用户按钮权限列表' })
  @Get('/getPermCodeList')
  async getPermCodeList(): Promise<string[]> {
    const { accountId, accountType } = this.app.getAuthInfo()
    return await this.service.getPermCodeList(accountId, accountType)
  }

  @ApiOperation({ summary: '创建' })
  @OperateLog({
    type: EOpertateType.ADD,
    desc: '创建资源',
  })
  @Post('/createOne')
  async createOne(
    @Body() createDto: CreateResourceDto,
  ): Promise<ResourceModel> {
    return await this.service.createOne(createDto)
  }

  @ApiOperation({ summary: '更新' })
  @OperateLog({
    type: EOpertateType.EDIT,
    desc: '编辑资源',
  })
  @Put('/updateOne')
  async updateOne(@Body() updateDto: UpdateResourceDto): Promise<boolean> {
    return await this.service.updateOne(updateDto)
  }

  @ApiOperation({ summary: '删除' })
  @OperateLog({
    type: EOpertateType.EDIT,
    desc: '删除资源',
  })
  @Delete('/delete')
  async delete(
    @Query('id', new ToArrayPipe()) ids: string[],
  ): Promise<boolean> {
    return await this.service.delete(ids)
  }
}
