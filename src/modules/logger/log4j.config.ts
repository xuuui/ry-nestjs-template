import { Configuration } from 'log4js'

const BASE_LOG_PATH = 'logs'

const log4jsConfig: Configuration = {
  appenders: {
    console: { type: 'stdout', layout: { type: 'console' } },
    // 统计日志
    access: {
      type: 'dateFile', // 写入文件格式，并按照日期分类
      filename: `${BASE_LOG_PATH}/access/access.log`, // 日志文件名，会命名为：access.2021-04-01.log
      alwaysIncludePattern: true, // 为true, 则每个文件都会按pattern命名，否则最新的文件不会按照pattern命名
      pattern: 'yyyy-MM-dd', // 日期格式
      numBackups: 3, //  日志文件最多存在个数
      compress: true, // 日志文件是否压缩
      keepFileExt: true, // 是否保留文件后缀
      layout: { type: 'file' },
    },
    // 异常日志
    errorFile: {
      type: 'file',
      filename: `${BASE_LOG_PATH}/error/error.log`,
      maxLogSize: 10485760,
      backups: 3,
      compress: true,
      keepFileExt: true,
      layout: { type: 'file' },
    },
    errors: {
      type: 'logLevelFilter',
      level: 'ERROR',
      appender: 'errorFile',
    },
  },

  categories: {
    default: {
      appenders: ['console', 'access', 'errors'],
      level: 'DEBUG',
    },
    TypeOrm: { appenders: ['access', 'errors', 'console'], level: 'INFO' },
  },
}

export default log4jsConfig
