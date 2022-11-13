import { Provider, Scope } from '@nestjs/common'
import { Log4jLoggerService } from './log4j-logger.service'
import { prefixesForLoggers } from './logger.decorator'

function createLoggerProvider(prefix: string): Provider<Log4jLoggerService> {
  const provider = {
    provide: `${prefix}Logger`,
    useFactory: (logger: Log4jLoggerService) => {
      if (prefix) {
        logger.setContext(prefix)
      }
      return logger
    },
    inject: [Log4jLoggerService],
    scope: Scope.DEFAULT,
  }
  return provider
}

export function createLoggerProviders(): Array<Provider<Log4jLoggerService>> {
  return prefixesForLoggers.map((prefix) => createLoggerProvider(prefix))
}
