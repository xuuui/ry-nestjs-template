import { BaseService } from '@/common/base/base.service'
import { ThirdAuthEntity } from '@/entities/sys/third-auth.entity'
import { Injectable } from '@nestjs/common'
import {
  Transaction,
  useTransaction,
} from '@ry-nestjs/typeorm-transactional-next'
import { DataSource } from 'typeorm'
import { CreateThirdAuthDto } from './dto/create-third-auth.dto'
import { UpdateThirdAuthDto } from './dto/update-third-auth.dto'

@Injectable()
export class ThirdAuthService extends BaseService<ThirdAuthEntity> {
  constructor(protected readonly dataSource: DataSource) {
    super(ThirdAuthEntity, dataSource)
  }

  @Transaction()
  async createOne(
    createThirdAuth: CreateThirdAuthDto,
  ): Promise<ThirdAuthEntity> {
    const manager = useTransaction()
    return manager.save(ThirdAuthEntity, createThirdAuth)
  }

  @Transaction()
  async updateOne(updateThirdAuthDto: UpdateThirdAuthDto): Promise<boolean> {
    const manager = useTransaction()
    const { id, ...dto } = updateThirdAuthDto
    await manager.findOneByOrFail(ThirdAuthEntity, {
      id,
    })
    await manager.update(ThirdAuthEntity, id, dto)
    return true
  }

  @Transaction()
  async updateMobileByUnionId(
    unionid: string,
    mobile: string,
  ): Promise<boolean> {
    const manager = useTransaction()
    await manager.update(ThirdAuthEntity, { unionid }, { mobile })
    return true
  }
}
