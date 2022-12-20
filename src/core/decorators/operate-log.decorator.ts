import { applyDecorators, SetMetadata } from '@nestjs/common'
import { OPERATE_LOG, OPERATE_LOG_OPTIONS } from '@/core/constants/decorator'
import { OperateLogOptions } from '../interfaces/sys'

/**
 * @description: 记录操作日志装饰器
 * @return {*}
 */
export function OperateLog(options?: OperateLogOptions) {
  return applyDecorators(
    SetMetadata(OPERATE_LOG, true),
    SetMetadata(OPERATE_LOG_OPTIONS, options),
  )
}
