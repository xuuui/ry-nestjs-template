import { SetMetadata } from '@nestjs/common'
import { ROUTE_METEDATA } from '@/core/constants/decorator'
import { RouteMetadata } from '../interfaces/sys'

/**
 * @description: 路由模块装饰器
 * @param {RouteMetadata} route
 * @return {*}
 */
export function Route(route: RouteMetadata) {
  return SetMetadata(ROUTE_METEDATA, route)
}
