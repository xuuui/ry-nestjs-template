import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common'
import { isNil } from 'lodash'

/**
 * @description: 转换数组格式
 * @return {array}
 */
@Injectable()
export class ToArrayPipe implements PipeTransform {
  transform(value: any | any[], metadata: ArgumentMetadata): any[] {
    if (isNil(value)) return []
    return Array.isArray(value) ? value : [value]
  }
}
