import { registerAs } from '@nestjs/config'
import { JwtConfig } from './types'
import { mergeEnvConfig } from './utils'

const config: JwtConfig = {
  secret: '',
  signOptions: {
    expiresIn: '7d',
  },
}

export default registerAs('jwt', (): JwtConfig => {
  return mergeEnvConfig(config, {
    secret: process.env.JWT_SECRET,
  })
})
