import { registerAs } from '@nestjs/config'
import type { WxConfig } from '../common/interfaces/config'
import { mergeEnvConfig } from './util'

const config: WxConfig = {
  offiaccount: {
    appId: '',
    appSecret: '',
    encodingAESKey: '',
  },
  miniprogram: {
    appId: '',
    appSecret: '',
  },
  mchId: '',
  mchSecret: '',
  certPath: '',
}

export default registerAs('wx', (): WxConfig => {
  return mergeEnvConfig(config, {
    offiaccount: {
      appId: process.env.WX_OA_APPID,
      appSecret: process.env.WX_OA_APPSECRET,
      encodingAESKey: process.env.WX_OA_ENCODINGAESKEY,
    },
    miniprogram: {
      appId: process.env.WX_MP_APPID,
      appSecret: process.env.WX_MP_APPSECRET,
    },
    mchId: process.env.WX_MCHID,
    mchSecret: process.env.WX_MCHSECRET,
    certPath: process.env.WX_CERTPATH,
  })
})
