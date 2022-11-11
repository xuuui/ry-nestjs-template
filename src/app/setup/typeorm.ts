import { TypeormConfig } from '@/config/types'
import { TypeOrmLogger } from '@/modules/logger/log4j'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

export function setupTypeorm() {
  return TypeOrmModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => {
      return {
        ...config.get<TypeormConfig>('typeorm'),
        logger: new TypeOrmLogger(),
      }
    },
  })
}
