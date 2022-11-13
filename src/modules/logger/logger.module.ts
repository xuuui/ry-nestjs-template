import { DynamicModule } from '@nestjs/common'
import { Log4jLoggerService } from './log4j-logger.service'
import { createLoggerProviders } from './logger.provider'

export class LoggerModule {
  static forRoot(): DynamicModule {
    const prefixedLoggerProviders = createLoggerProviders()
    const loggers = [Log4jLoggerService, ...prefixedLoggerProviders]
    return {
      module: LoggerModule,
      providers: loggers,
      exports: loggers,
    }
  }
}
