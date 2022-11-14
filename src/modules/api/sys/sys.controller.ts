import { NoResTransform } from '@/core/decorators/res-transform.decorator'
import { RedisCacheService } from '@/modules/shared/redis-cache/redis-cache.service'
import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { SysService } from './sys.service'
import { Response } from 'express'
import { RateLimit } from 'nestjs-rate-limiter'
import { ReqLimitGuard } from '@/core/guards/req-limit.guard'

@ApiTags('系统模块')
@Controller()
export class SysController {
  constructor(
    private readonly service: SysService,
    private readonly redisCache: RedisCacheService,
  ) {}

  @ApiOperation({ summary: '获取图片验证码' })
  @UseGuards(ReqLimitGuard)
  @RateLimit({
    points: 5,
    duration: 10,
  })
  @NoResTransform()
  @Get('/captcha')
  async getCaptcha(@Query('random') random: string, @Res() res: Response) {
    const captcha = this.service.getCaptcha()
    await this.redisCache.set(
      this.redisCache.getCaptchaKey(random),
      captcha.text,
      300,
    )
    res.type('image/svg+xml')
    res.send(captcha.data)
  }
}
