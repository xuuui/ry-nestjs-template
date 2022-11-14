import { applyDecorators } from '@nestjs/common'
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger'
import {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface'
import { PaginationDto } from '../dto/pagination.dto'

/**
 * @description: swagger 分页响应
 * @param {array} types
 * @return {*}
 */
export function ApiPaginationResponse(...types: any[]) {
  return applyDecorators(
    ApiExtraModels(PaginationDto),
    ApiExtraModels(...types),
    ApiOkResponse({
      schema: {
        oneOf: [
          ...types.map((item): SchemaObject | ReferenceObject => {
            return {
              $ref: getSchemaPath(PaginationDto),
              properties: {
                result: {
                  type: 'array',
                  items: { $ref: getSchemaPath(item) },
                },
              },
            }
          }),
          ...types.map((item): SchemaObject | ReferenceObject => {
            return {
              title: `${item.name}List`,
              items: { $ref: getSchemaPath(item) },
              type: 'array',
            }
          }),
        ],
      },
    }),
  )
}
