import { NumberValidator } from '../decorators/class-validator/number.decorator'

export class SysDto {
  /**
   * @description: 系统数据
   */
  @NumberValidator({
    optional: true,
  })
  isSys?: number
}
