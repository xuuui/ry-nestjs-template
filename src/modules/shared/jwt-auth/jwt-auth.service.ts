import { AuthInfo } from '@/core/interfaces/sys'
import jwtConfig from '@/config/jwt.config'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class JwtAuthService {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtCfg: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
  ) {}

  generateToken(fields: AuthInfo): string {
    return this.jwtService.sign(fields)
  }

  verifyToken(token: string): Promise<AuthInfo> {
    return this.jwtService.verifyAsync(token, {
      secret: this.jwtCfg.secret,
    })
  }
}
