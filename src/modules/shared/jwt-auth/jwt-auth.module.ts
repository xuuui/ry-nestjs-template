import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt'
import { JwtAuthService } from './jwt-auth.service'

const services = [JwtAuthService]

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        config.get<JwtModuleOptions>('jwt'),
    }),
  ],
  providers: [...services],
  exports: [JwtModule, ...services],
})
export class JwtAuthModule {}
