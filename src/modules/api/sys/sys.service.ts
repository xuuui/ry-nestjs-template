import { Captcha } from '@/common/interfaces/sys'
import { Injectable } from '@nestjs/common'
import svgCaptcha from 'svg-captcha'

@Injectable()
export class SysService {
  constructor() {}

  getCaptcha(): Captcha {
    const captcha: Captcha = svgCaptcha.create({
      size: 4,
      fontSize: 50,
      width: 130,
      height: 46,
      color: true,
    })
    return captcha
  }
}
