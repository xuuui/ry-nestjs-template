import { registerAs } from '@nestjs/config'
import { JwtConfig } from '../core/interfaces/config'
import { mergeEnvConfig } from './util'

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
