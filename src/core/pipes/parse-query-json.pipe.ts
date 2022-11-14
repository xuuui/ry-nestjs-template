import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common'
import { isJSON } from 'class-validator'

/**
 * @description: 转换json格式
 * @return {*}
 */
@Injectable()
export class ParseQueryJsonPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    if (metadata.type === 'query' && metadata.data && isJSON(value))
      return JSON.parse(value)
    return value
  }
}
