import { StringValidator } from '../decorators/class-validator/string.decorator'

export class UpdateDto {
  /**
   * @description: 更新id
   */
  @StringValidator()
  id: string
}
