import { ActionFailException } from './action-fail.exception'

export class NotFoundException extends ActionFailException {
  constructor(message: string = '数据不存在') {
    super(message)
  }
}
