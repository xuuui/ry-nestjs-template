import { Global, Module } from '@nestjs/common'
import { Log4jLoggerService } from './log4j-logger.service'

@Global()
@Module({
  providers: [Log4jLoggerService],
  exports: [Log4jLoggerService],
})
export class LoggerModule {}
