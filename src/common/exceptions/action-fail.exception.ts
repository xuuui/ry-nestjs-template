import { HttpException, HttpStatus } from '@nestjs/common'

export class ActionFailException extends HttpException {
  constructor(message?: string | string[]) {
    super(
      (Array.isArray(message) ? message.join(';') : message) || '操作失败',
      HttpStatus.OK,
    )
  }
}
