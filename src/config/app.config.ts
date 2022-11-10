import { registerAs } from '@nestjs/config'
import type { AppConfig } from './types'
import { mergeEnvConfig } from './utils'

const config: AppConfig = {
  prefix: '',
  port: 7000,
  apiPrefix: 'api',
  staticRoot: 'public',
  domain: '',
  ip: '',
  defaltAccount: {
    username: 'admin',
    password: '123456',
  },
}

export default registerAs('app', (): AppConfig => {
  return mergeEnvConfig(config, {
    port: Number(process.env.PORT),
    prefix: process.env.PREFIX,
    domain: process.env.DOMAIN,
    ip: process.env.IP,
  })
})
