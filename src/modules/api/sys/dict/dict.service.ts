import { BaseService } from '@/core/base/base.service'
import { EDictType } from '@/core/enums/sys.enum'
import { ActionFailException } from '@/core/exceptions/action-fail.exception'
import { Injectable } from '@nestjs/common'
import { FindOptionsWhere, DataSource, In, Not } from 'typeorm'
import { CreateDictDto } from './dto/create-dict.dto'
import { UpdateDictDto } from './dto/update-dict.dto'
import { DictEntity } from '@/entities/sys/dict.entity'
import { ValExistDto } from '@/core/dto/val-exist.dto'
import { DictModel } from '@/models/sys/dict.model'
import {
  Transaction,
  useTransaction,
} from '@ry-nestjs/typeorm-transactional-next'

@Injectable()
export class DictService extends BaseService<DictEntity> {
  constructor(protected readonly dataSource: DataSource) {
    super(DictEntity, dataSource)
  }

  async isCodeExist(valExistDto: ValExistDto): Promise<boolean> {
    const { value, excludeId } = valExistDto
    const where: FindOptionsWhere<DictEntity> = {
      code: value,
    }
    if (excludeId) where.id = Not(excludeId)
    return !!(await this.findOne({ where }))
  }

  async getMap(): Promise<Mapable<DictModel>> {
    const dictMap: Mapable<DictModel> = new Map()
    const dicts: DictModel[] = await this.dataSource.manager
      .createQueryBuilder(DictEntity, 'dict')
      .leftJoinAndMapMany(
        'dict.items',
        DictEntity,
        'item',
        'item.parentId = dict.id',
      )
      .where('dict.parentId IS NULL')
      .getMany()

    dicts.forEach((dict) => {
      dictMap.set(dict.code, dict)
    })
    return dictMap
  }

  async getItemsByCode(code: string): Promise<DictModel[]> {
    const dict = await this.dataSource.manager.findOneOrFail(DictEntity, {
      where: { code },
    })
    return await this.dataSource.manager.find(DictEntity, {
      where: {
        parentId: dict.id,
      },
    })
  }

  @Transaction()
  async createOne(createDto: CreateDictDto): Promise<DictModel> {
    const manager = useTransaction()
    if (createDto.type === EDictType.DICT) {
      if (!createDto.code) {
        throw new ActionFailException('请输入编码')
      }
      const isCodeExist = await this.isCodeExist({
        value: createDto.code,
      })
      if (isCodeExist) {
        throw new ActionFailException('编码已存在')
      }
    }
    return await manager.save(DictEntity, createDto)
  }

  @Transaction()
  async updateOne(updateDto: UpdateDictDto): Promise<boolean> {
    const manager = useTransaction()
    const { id, ...update } = updateDto
    await manager.findOneOrFail(DictEntity, { where: { id } })
    if (update.type === EDictType.DICT) {
      if (!updateDto.code) {
        throw new ActionFailException('请输入编码')
      }
      const isCodeExist = await this.isCodeExist({
        value: updateDto.code,
        excludeId: id,
      })
      if (isCodeExist) {
        throw new ActionFailException('编码已存在')
      }
    }
    await manager.update(DictEntity, { id }, update)
    return true
  }

  @Transaction()
  async delete(ids: string[]): Promise<boolean> {
    const manager = useTransaction()
    // 删除字典
    await manager.softDelete(DictEntity, {
      id: In(ids),
    })
    // 删除字典项
    await manager.softDelete(DictEntity, {
      parentId: In(ids),
    })
    return true
  }
}
