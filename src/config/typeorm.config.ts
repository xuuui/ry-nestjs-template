import { registerAs } from '@nestjs/config'
import { join } from 'path'
import type { TypeormConfig } from './types'
import { mergeEnvConfig, strToBool } from './utils'

const config: TypeormConfig = {
  type: 'mysql',
  charset: 'utf8mb4',
  host: 'localhost',
  port: 3306,
  synchronize: false,
  logging: false,
  entities: [join(__dirname, '../entities/**/*.entity{.ts,.js}')],
}

export default registerAs('typeorm', (): TypeormConfig => {
  return mergeEnvConfig(config, {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_DB,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PWD,
    synchronize: strToBool(process.env.DB_SYNC),
    logging: strToBool(process.env.DB_LOGGING),
  })
})
