import { Injectable } from '@nestjs/common'
import { DataSource, EntityTarget, Repository } from 'typeorm'
import { PaginationDto } from '@/core/dto/pagination.dto'
import { BaseEntity } from './base.entity'
import { ParsedQueryParams, QueryBuilder } from '@ry-nestjs/typeorm-query'

@Injectable()
export class BaseService<T extends BaseEntity> {
  protected readonly repo: Repository<T>

  constructor(
    private readonly entity: EntityTarget<T>,
    protected readonly dataSource: DataSource,
  ) {
    this.repo = this.dataSource.getRepository(this.entity)
  }

  get findOne(): Repository<T>['findOne'] {
    return this.repo.findOne.bind(this.repo)
  }

  get findOneBy(): Repository<T>['findOneBy'] {
    return this.repo.findOneBy.bind(this.repo)
  }

  get findOneOrFail(): Repository<T>['findOneOrFail'] {
    return this.repo.findOneOrFail.bind(this.repo)
  }

  get find(): Repository<T>['find'] {
    return this.repo.find.bind(this.repo)
  }

  get count(): Repository<T>['count'] {
    return this.repo.count.bind(this.repo)
  }

  get softDelete(): Repository<T>['softDelete'] {
    return this.repo.softDelete.bind(this.repo)
  }

  get remove(): Repository<T>['delete'] {
    return this.repo.delete.bind(this.repo)
  }

  async baseQueryList(
    parsed: ParsedQueryParams,
  ): Promise<T[] | PaginationDto<T>> {
    const builder = this.repo.createQueryBuilder()
    return await QueryBuilder.create(builder).parseQuery(parsed).paginate()
  }

  /**
   * @description: 拼接距离 select sql
   * @param {number} longitude 经度
   * @param {number} latitude 纬度
   * @return {*}
   */
  getDistanceSelectSql(
    alias: string,
    longitude: number,
    latitude: number,
  ): string {
    return `st_distance(point(${alias}.longitude,${alias}.latitude),point(${longitude},${latitude}))*111195/1000`
  }
}
