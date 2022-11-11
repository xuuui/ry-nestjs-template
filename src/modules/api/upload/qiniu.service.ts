import { Injectable } from '@nestjs/common'
import qiniu from 'qiniu'

@Injectable()
export class QiniuService {
  private readonly accessKey = 'vu6D2g-jBvbwpDSE18OUpVo_gjIcjwh_3x-IF4Zw'
  private readonly secretKey = 'T9IbwpA42kdviWmFWhLMJEjHptKYTC_m3-HLPpkb'
  private readonly bucket = 'rrryyi'
  private readonly mac: qiniu.auth.digest.Mac

  constructor() {
    this.mac = new qiniu.auth.digest.Mac(this.accessKey, this.secretKey)
  }

  getUploadToken(): string {
    const putPolicy = new qiniu.rs.PutPolicy({
      scope: this.bucket,
    })
    const uploadToken = putPolicy.uploadToken(this.mac)
    return uploadToken
  }
}
