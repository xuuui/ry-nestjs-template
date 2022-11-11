import { EAccountType } from '@/common/enums/sys.enum'
import appConfig from '@/config/app.config'
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { ensureFileSync, existsSync } from 'fs-extra'
import { AccountService } from '../api/sys/account/account.service'

const INIT_LOCK_FILE = 'init.lock.txt'

@Injectable()
export class InitService implements OnModuleInit {
  constructor(
    @Inject(appConfig.KEY)
    private readonly appCfg: ConfigType<typeof appConfig>,
    private readonly accountService: AccountService,
  ) {}

  async onModuleInit() {
    if (!existsSync(INIT_LOCK_FILE)) {
      Logger.log('初始化数据库', 'InitModule')
      await this.initAdmin()
      ensureFileSync(INIT_LOCK_FILE)
    } else {
      Logger.log('已初始化数据库', 'InitModule')
    }
  }

  private async initAdmin(): Promise<void> {
    const { username, password } = this.appCfg.defaltAccount
    const isExist = await this.accountService.isUsernameExist(
      {
        value: username,
      },
      EAccountType.MANAGE,
    )
    if (!isExist) {
      await this.accountService.createAdmin({
        username,
        password,
        isSys: 1,
        isSuperAdmin: 1,
        accountType: EAccountType.MANAGE,
      })
    }
    Logger.log(`默认管理员 ${username} ${password}`, 'InitModule')
  }
}
