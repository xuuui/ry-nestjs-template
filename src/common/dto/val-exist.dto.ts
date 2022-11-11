import { StringValidator } from '../decorators/class-validator/string.decorator'

export class ValExistDto {
  /**
   * @description: 值
   */
  @StringValidator()
  value: string

  /**
   * @description: 过滤id
   */
  @StringValidator({
    optional: true,
  })
  excludeId?: string
}
