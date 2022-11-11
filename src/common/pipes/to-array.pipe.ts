import { isNullOrUnDef } from '@/utils/is'
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common'

/**
 * @description: 转换数组格式
 * @return {array}
 */
@Injectable()
export class ToArrayPipe implements PipeTransform {
  transform(value: any | any[], metadata: ArgumentMetadata): any[] {
    if (isNullOrUnDef(value)) return []
    return Array.isArray(value) ? value : [value]
  }
}
