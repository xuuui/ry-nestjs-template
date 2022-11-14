import {
  EAccountType,
  EDictType,
  EResourceType,
  ESysDictCode,
} from '@/core/enums/sys.enum'
import appConfig from '@/config/app.config'
import { DictModel } from '@/models/sys/dict.model'
import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { ensureFileSync, existsSync } from 'fs-extra'
import { AccountService } from '../api/sys/account/account.service'
import { DictService } from '../api/sys/dict/dict.service'
import { ResourceService } from '../api/sys/resource/resource.service'
import { Log4jLoggerService } from '../logger/log4j-logger.service'
import { InjectLogger } from '../logger/logger.decorator'

const INIT_LOCK_FILE = 'init.lock.txt'

@Injectable()
export class InitService implements OnModuleInit {
  constructor(
    @InjectLogger(InitService.name)
    private readonly logger: Log4jLoggerService,
    @Inject(appConfig.KEY)
    private readonly appCfg: ConfigType<typeof appConfig>,
    private readonly accountService: AccountService,
    private readonly resourceService: ResourceService,
    private readonly dictService: DictService,
  ) {}

  async onModuleInit() {
    const { username } = this.appCfg.defaltAccount
    const isAdminExist = await this.accountService.isUsernameExist(
      {
        value: username,
      },
      EAccountType.MANAGE,
    )
    if (!isAdminExist && !existsSync(INIT_LOCK_FILE)) {
      this.logger.log('初始化数据库')
      await this.initDict()
      await this.initResource()
      await this.initAdmin()
      ensureFileSync(INIT_LOCK_FILE)
    } else {
      this.logger.log('已初始化数据库')
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
    this.logger.log(`默认管理员初始化完成 ${username} ${password}`)
  }

  private async generateDictItems(
    dict: DictModel,
    list: { label: string; value: string }[],
  ): Promise<void> {
    for (const item of list) {
      await this.dictService.createOne({
        label: item.label,
        value: item.value,
        parentId: dict.id,
        isSys: dict.isSys,
        type: EDictType.DICT_ITEM,
      })
    }
  }

  private async initDict(): Promise<void> {
    // 是否
    const sysYesNo = await this.dictService.createOne({
      code: ESysDictCode.SYS_YES_NO,
      label: '是否',
      type: EDictType.DICT,
      isSys: 1,
    })
    await this.generateDictItems(sysYesNo, [
      {
        label: '是',
        value: '1',
      },
      {
        label: '否',
        value: '0',
      },
    ])
    // 性别
    const sysSex = await this.dictService.createOne({
      code: ESysDictCode.SYS_SEX,
      label: '性别',
      type: EDictType.DICT,
      isSys: 1,
    })
    await this.generateDictItems(sysSex, [
      {
        label: '未知',
        value: '0',
      },
      {
        label: '男',
        value: '1',
      },
      {
        label: '女',
        value: '2',
      },
    ])
    // 状态
    const sysState = await this.dictService.createOne({
      code: ESysDictCode.SYS_STATE,
      label: '状态',
      type: EDictType.DICT,
      isSys: 1,
    })
    await this.generateDictItems(sysState, [
      {
        label: '禁用',
        value: '0',
      },
      {
        label: '正常',
        value: '1',
      },
    ])
    // 操作类型
    const sysOperateType = await this.dictService.createOne({
      code: ESysDictCode.SYS_OPERATE_TYPE,
      label: '状态',
      type: EDictType.DICT,
      isSys: 1,
    })
    await this.generateDictItems(sysOperateType, [
      {
        label: '其它',
        value: 'other',
      },
      {
        label: '删除',
        value: 'del',
      },
      {
        label: '编辑',
        value: 'edit',
      },
      {
        label: '添加',
        value: 'add',
      },
      {
        label: '查看',
        value: 'view',
      },
      {
        label: '登录',
        value: 'login',
      },
    ])
    // 余额变动类型
    const sysBalanceChangeType = await this.dictService.createOne({
      code: ESysDictCode.SYS_BALANCE_CHANGE_TYPE,
      label: '余额变动类型',
      type: EDictType.DICT,
      isSys: 1,
    })
    await this.generateDictItems(sysBalanceChangeType, [
      {
        label: '支出',
        value: '2',
      },
      {
        label: '收入',
        value: '1',
      },
    ])
    this.logger.log('字典初始化完成')
  }

  private async initResource(): Promise<void> {
    const system = await this.resourceService.createOne({
      title: '系统管理',
      name: 'System',
      type: EResourceType.ROUTE,
      path: '/system',
      icon: 'ant-design:setting-outlined',
      sort: 0,
      component: 'LAYOUT',
      accountType: EAccountType.MANAGE,
      isSys: 1,
    })
    await this.resourceService.createOne({
      parentId: system.id,
      title: '资源管理',
      name: 'SystemResource',
      type: EResourceType.MENU,
      path: 'resource',
      icon: 'ant-design:menu-outlined',
      component: '/system/resource/index',
      accountType: EAccountType.MANAGE,
      isSys: 1,
      sort: 0,
    })
    await this.resourceService.createOne({
      parentId: system.id,
      title: '字典管理',
      name: 'SystemDict',
      type: EResourceType.MENU,
      path: 'dict',
      icon: 'ant-design:book-outlined',
      component: '/system/dict/index',
      accountType: EAccountType.MANAGE,
      isSys: 1,
      sort: 1,
    })
    await this.resourceService.createOne({
      parentId: system.id,
      title: '角色管理',
      name: 'SystemRole',
      type: EResourceType.MENU,
      path: 'role',
      icon: 'ant-design:user-switch-outlined',
      component: '/system/role/index',
      accountType: EAccountType.MANAGE,
      isSys: 1,
      sort: 2,
    })
    await this.resourceService.createOne({
      parentId: system.id,
      title: '账户管理',
      name: 'SystemAccount',
      type: EResourceType.MENU,
      path: 'account',
      icon: 'ant-design:user-outlined',
      component: '/system/account/index',
      accountType: EAccountType.MANAGE,
      isSys: 1,
      sort: 3,
    })
    await this.resourceService.createOne({
      parentId: system.id,
      title: '操作日志',
      name: 'SystemOperateLog',
      type: EResourceType.MENU,
      path: 'operateLog',
      icon: 'ant-design:exception-outlined',
      component: '/system/operate-log/index',
      accountType: EAccountType.MANAGE,
      isSys: 1,
      sort: 4,
    })
    this.logger.log('菜单初始化完成')
  }
}
