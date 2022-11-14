import { LoggerModule } from '@/modules/logger/logger.module'
import { ClassSerializerInterceptor, Global, Module } from '@nestjs/common'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ClsModule } from 'nestjs-cls'
import { SharedModule } from '@/modules/shared/shared.module'
import { AnyExceptionFilter } from '@/core/filters/any-exception.filter'
import { ResTransformInterceptor } from '@/core/interceptors/res-transform.interceptor'
import { LoggerInterceptor } from '@/core/interceptors/logger.interceptor'
import { JwtAuthGuard } from '@/core/guards/jwt-auth.guard'
import { ApiModule } from '@/modules/api/api.module'
import { RouteModule } from '@/modules/route/route.module'
import { EntitiesModule } from '@/entities/entities.module'
import { RateLimiterModule } from 'nestjs-rate-limiter'
import { OperateLogInterceptor } from '@/core/interceptors/operate-log.interceptor'
import { InitModule } from '@/modules/init/init.module'
import { setupConfig } from './setup/config'
import { setupServeStatic } from './setup/serve-static'
import { setupRateLimiter } from './setup/rate-limiter'
import { setupTypeorm } from './setup/typeorm'
import { setupCls } from './setup/cls'

@Global()
@Module({
  imports: [
    setupConfig(),
    setupServeStatic(),
    LoggerModule.forRoot(),
    SharedModule,
    setupCls(),
    setupRateLimiter(),
    setupTypeorm(),
    EntitiesModule,
    RouteModule,
    InitModule,
    ApiModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AnyExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResTransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: OperateLogInterceptor,
    },
    AppService,
  ],
  exports: [AppService, RateLimiterModule],
  controllers: [AppController],
})
export class AppModule {}
