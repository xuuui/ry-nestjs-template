/**
 * @description: http状态
 */
export enum EHttpStatus {
  FAIL = 'fail',
  SUCCESS = 'success',
}

/**
 * @description: 系统字典编码
 */
export enum ESysDictCode {
  SYS_YES_NO = 'sys_yes_no',
  SYS_SEX = 'sys_sex',
  SYS_STATE = 'sys_state',
  SYS_OPERATE_TYPE = 'sys_operate_type',
  SYS_BALANCE_CHANGE_TYPE = 'sys_balance_change_type',
}

/**
 * @description: 账户类型
 */
export enum EAccountType {
  /**
   * @description: 平台端
   */
  MANAGE = 'manage',
  /**
   * @description: 租户端
   */
  TENANT = 'tenant',
  /**
   * @description: 客户端
   */
  CLIENT = 'client',
}

/**
 * @description: 第三方平台
 */
export enum EThirdPlatform {
  MP_WEIXIN = 'mp_weixin',
  GZH_WEIXIN = 'gzh_weixin',
}

/**
 * @description: 资源类型
 */
export enum EResourceType {
  /**
   * @description: 路由
   */
  ROUTE = 'route',
  /**
   * @description: 菜单
   */
  MENU = 'menu',
  /**
   * @description: 按钮
   */
  BUTTON = 'button',
}

/**
 * @description: 资源权限
 */
export enum EResourcePermissionLabel {
  ADD = '新增',
  VIEW = '查看',
  EDIT = '编辑',
  DEL = '删除',
}

/**
 * @description: 字典类型
 */
export enum EDictType {
  DICT = 'dict',
  DICT_ITEM = 'dict_item',
}

/**
 * @description: 操作类型
 */
export enum EOpertateType {
  LOGIN = 'login',
  EXIT = 'exit',
  VIEW = 'view',
  ADD = 'add',
  EDIT = 'edit',
  DEL = 'del',
  OTHER = 'other',
}

/**
 * @description: 余额变动类型
 */
export enum EBalanceChangeType {
  /**
   * @description: 收入
   */
  INCOME = 1,
  /**
   * @description: 支出
   */
  EXPEND = 2,
}
