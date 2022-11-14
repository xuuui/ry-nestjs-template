import { Expose } from 'class-transformer'
import { Pagination } from '@ry-nestjs/typeorm-query'
import { NumberValidator } from '../decorators/class-validator/number.decorator'

export class PaginationDto<T> implements Pagination<T> {
  /**
   * @description: 返回结果
   */
  @Expose()
  result: T[]
  /**
   * @description: 总数量
   */
  @NumberValidator()
  total: number
  /**
   * @description: 总页数
   */
  @NumberValidator()
  pageCount: number
  /**
   * @description: 当前数量
   */
  @NumberValidator()
  count: number
  /**
   * @description: 当前分页
   */
  @NumberValidator()
  limit: number
  /**
   * @description: 当前页数
   */
  @NumberValidator()
  page: number
}
