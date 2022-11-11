import appConfig from '@/config/app.config'
import jwtConfig from '@/config/jwt.config'
import redisConfig from '@/config/redis.config'
import typeormConfig from '@/config/typeorm.config'
import { getEnvConfigFile } from '@/config/utils'
import wxConfig from '@/config/wx.config'
import { ConfigModule } from '@nestjs/config'

export function setupConfig() {
  return ConfigModule.forRoot({
    encoding: 'utf-8',
    isGlobal: true,
    envFilePath: [getEnvConfigFile(), '.env'],
    load: [appConfig, typeormConfig, redisConfig, jwtConfig, wxConfig],
  })
}
