import { TypeormConfig } from '@/core/interfaces/config'
import { TypeOrmLogger } from '@/modules/logger/typeorm-logger'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

export function setupTypeorm() {
  return TypeOrmModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => {
      const typeormConfig = config.get<TypeormConfig>('typeorm')
      return {
        ...typeormConfig,
        logger: new TypeOrmLogger(typeormConfig),
      }
    },
  })
}
