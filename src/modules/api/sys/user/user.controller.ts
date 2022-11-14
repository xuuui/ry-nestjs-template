import { JwtAuth } from '@/core/decorators/jwt-auth.decorator'
import { Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { UserService } from './user.service'

@ApiTags('用户模块')
@JwtAuth()
@Controller()
export class UserController {
  constructor(private readonly service: UserService) {}
}
