import { AppService } from '@/app/app.service'
import { BaseService } from '@/core/base/base.service'
import { DATE_TEMPLATE } from '@/core/constants/sys'
import { EOpertateType } from '@/core/enums/sys.enum'
import { AuthInfo, OperateLogOptions } from '@/core/interfaces/sys'
import { OperateLogEntity } from '@/entities/sys/operate-log.entity'
import { Injectable } from '@nestjs/common'
import axios from 'axios'
import dayjs from 'dayjs'
import { isFunction } from 'lodash'
import { DataSource } from 'typeorm'
import iconv from 'iconv-lite'
import {
  Transaction,
  useTransaction,
} from '@ry-nestjs/typeorm-transactional-next'
import { Log4jLoggerService } from '@/modules/logger/log4j-logger.service'
import { InjectLogger } from '@/modules/logger/logger.decorator'

@Injectable()
export class OperateLogService extends BaseService<OperateLogEntity> {
  constructor(
    @InjectLogger(OperateLogService.name)
    private readonly logger: Log4jLoggerService,
    protected readonly dataSource: DataSource,
    private readonly app: AppService,
  ) {
    super(OperateLogEntity, dataSource)
  }

  @Transaction()
  async createOperateLog(
    options: OperateLogOptions,
    error?: Error | string,
  ): Promise<void> {
    try {
      const manager = useTransaction()
      const authInfo = this.app.getAuthInfo()
      const clientIp = this.app.getClientIp()
      const res = this.app.getRes()
      const req = this.app.getReq()

      const desc = isFunction(options.desc)
        ? options.desc(req, res)
        : options.desc

      const ipAddress = await this.fetchOperateIpAddress(clientIp)
      await manager.insert(OperateLogEntity, {
        operateType: options.type,
        operateId: authInfo.accountId,
        operateUsername: authInfo.username,
        operateTime: dayjs().format(DATE_TEMPLATE),
        operateDesc: desc || this.getDefOperateDesc(options.type, authInfo),
        operateIp: clientIp,
        operateIpAddress: ipAddress,
        reqQuery: req.query,
        reqBody: req.body,
        apiPath: req.path,
        accountType: authInfo.accountType,
        state: !!error ? 0 : 1,
        errMsg: error ? error.toString() : '',
      })
    } catch (error) {
      this.logger.error({ ...this.logger.getHttpLogInfo(), error })
    }
  }

  getDefOperateDesc(type: EOpertateType, authInfo: AuthInfo): string {
    let desc = ''
    switch (type) {
      case EOpertateType.LOGIN:
        desc = '??????'
        break
      case EOpertateType.EXIT:
        desc = '??????'
        break
      default:
        break
    }
    return desc
  }

  async fetchOperateIpAddress(ip: string): Promise<string> {
    if (!ip) return ''
    const url = `http://whois.pconline.com.cn/ipJson.jsp?ip=${ip}&json=true`
    const res = await axios.get(url, {
      responseType: 'arraybuffer',
    })
    const data = JSON.parse(iconv.decode(res.data, 'gbk'))
    if (res.status !== 200 || data.err) return ''
    return data.addr
  }
}
