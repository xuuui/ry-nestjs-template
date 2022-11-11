import { generateRoutes } from '@/utils/route'
import { Module } from '@nestjs/common'
import { RouterModule, Routes } from '@nestjs/core'
import { ApiModule } from '../api/api.module'

const routes: Routes = generateRoutes([ApiModule])

@Module({
  imports: [RouterModule.register(routes)],
  exports: [RouterModule.register(routes)],
})
export class RouteModule {}
