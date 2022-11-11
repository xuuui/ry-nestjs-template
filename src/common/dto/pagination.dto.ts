import { Expose } from 'class-transformer'
import { Pagination } from '@ry-nestjs/typeorm-query'

export class PaginationDto<T> implements Pagination<T> {
  /**
   * @description: 返回结果
   */
  @Expose()
  result: T[]
  /**
   * @description: 总数量
   */
  @Expose()
  total: number
  /**
   * @description: 总页数
   */
  @Expose()
  pageCount: number
  /**
   * @description: 当前数量
   */
  @Expose()
  count: number
  /**
   * @description: 当前分页
   */
  @Expose()
  limit: number
  /**
   * @description: 当前页数
   */
  @Expose()
  page: number
}
