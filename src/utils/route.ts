import { ROUTE_METEDATA } from '@/common/constants/decorator'
import { getLogger } from '@/modules/logger/log4j'
import { Type } from '@nestjs/common'

export function generateRoutes(modules: Type<any>[]) {
  const logger = getLogger('')
  const routes = []
  modules.forEach((module) => {
    const root = Reflect.getMetadata(ROUTE_METEDATA, module)
    if (!root) {
      logger.warn(`Is ${module.name} register with Route decorator?`)
      return
    }
    routes.push({
      path: root.path,
      module,
      children: generateRoutes(root?.children ?? []),
    })
  })
  return routes
}
