import path from 'path'
import log4js from 'log4js'
import util from 'util'
import dayjs from 'dayjs'
import chalk from 'chalk'
import StackTrace from 'stacktrace-js'
import log4jConfig from './log4j.config'
import { QueryRunner } from 'typeorm'

// 定义日志级别
export enum LoggerLevel {
  ALL = 'ALL',
  MARK = 'MARK',
  TRACE = 'TRACE',
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  FATAL = 'FATAL',
  OFF = 'OFF',
}

export class ContextTrace {
  constructor(
    public readonly context: string,
    public readonly path?: string,
    public readonly lineNumber?: number,
    public readonly columnNumber?: number,
  ) {}
}

const customLayout = (
  logEvent: log4js.LoggingEvent,
  color: boolean = false,
): string => {
  let moduleName: string = ''
  let position: string = ''

  // 日志组装
  const messageList: string[] = []
  logEvent.data.forEach((value: any) => {
    if (value instanceof ContextTrace) {
      moduleName = value.context
      // 显示触发日志的坐标（行，列）

      if (value.lineNumber && value.columnNumber) {
        position = `${value.lineNumber}, ${value.columnNumber}`
      }
      return
    }

    if (typeof value !== 'string') {
      value = util.inspect(value, {
        colors: color,
        depth: null,
      })
    }

    messageList.push(value)
  })

  // 日志组成部分

  let contextOutput = logEvent.context?.context
    ? `[${logEvent.context.context}] `
    : ''
  let messageOutput: string = messageList.join('')
  const positionOutput: string = position ? ` [${position}]` : ''

  let dateOutput: string = `${dayjs(logEvent.startTime).format(
    'YYYY-MM-DD HH:mm:ss',
  )} [${logEvent.pid.toString()}] `

  let moduleOutput: string = `[${
    moduleName ? moduleName : logEvent.categoryName
  }] `

  let levelOutput: string = `[${logEvent.level}] `

  if (color) {
    dateOutput = chalk.green(dateOutput)
    contextOutput = chalk.yellow(contextOutput)
    moduleOutput = chalk.yellow(moduleOutput)

    switch (logEvent.level.toString()) {
      case LoggerLevel.DEBUG:
        messageOutput = chalk.green(messageOutput)
        levelOutput = chalk.green(levelOutput)
        break
      case LoggerLevel.INFO:
        messageOutput = chalk.cyan(messageOutput)
        levelOutput = chalk.cyan(levelOutput)
        break
      case LoggerLevel.WARN:
        messageOutput = chalk.yellow(messageOutput)
        levelOutput = chalk.yellow(levelOutput)
        break
      case LoggerLevel.ERROR:
        messageOutput = chalk.red(messageOutput)
        levelOutput = chalk.red(levelOutput)
        break
      case LoggerLevel.FATAL:
        messageOutput = chalk.hex('#DD4C35')(messageOutput)
        levelOutput = chalk.hex('#DD4C35')(levelOutput)
        break
      default:
        messageOutput = chalk.grey(messageOutput)
        levelOutput = chalk.grey(levelOutput)
        break
    }
  }

  return `${moduleOutput}${dateOutput}${levelOutput}${contextOutput}${messageOutput}${positionOutput}`
}

log4js.addLayout('console', (logConfig: any) => {
  return (logEvent: log4js.LoggingEvent): string => {
    return customLayout(logEvent, true)
  }
})

log4js.addLayout('file', (logConfig: any) => {
  return (logEvent: log4js.LoggingEvent): string => {
    return customLayout(logEvent)
  }
})

// 配置
log4js.configure(log4jConfig)

// 实例化
export const logger = log4js.getLogger('default')
logger.level = LoggerLevel.TRACE

export class log4jLogger {
  static trace(...args: any[]) {
    logger.trace(log4jLogger.getStackTrace(), ...args)
  }

  static debug(...args: any[]) {
    logger.debug(log4jLogger.getStackTrace(), ...args)
  }

  static log(...args: any[]) {
    logger.info(log4jLogger.getStackTrace(), ...args)
  }

  static info(...args: any[]) {
    logger.info(log4jLogger.getStackTrace(), ...args)
  }

  static warn(...args: any[]) {
    logger.warn(log4jLogger.getStackTrace(), ...args)
  }

  static warning(...args: any[]) {
    logger.warn(log4jLogger.getStackTrace(), ...args)
  }

  static error(...args: any[]) {
    logger.error(log4jLogger.getStackTrace(), ...args)
  }

  static fatal(...args: any[]) {
    logger.fatal(log4jLogger.getStackTrace(), ...args)
  }

  static getStackTrace(deep: number = 2): string {
    const stackList: StackTrace.StackFrame[] = StackTrace.getSync()
    const stackInfo: StackTrace.StackFrame = stackList[deep]
    const lineNumber: number = stackInfo.lineNumber
    const columnNumber: number = stackInfo.columnNumber
    const fileName: string = stackInfo.fileName
    const basename: string = path.basename(fileName)
    return `${basename}(line: ${lineNumber}, column: ${columnNumber}): \n`
  }
}

export const nestLogger = log4js.getLogger('Nest')

export const typeOrmLogger = log4js.getLogger('TypeOrm')

export class TypeOrmLogger implements log4jLogger {
  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    typeOrmLogger.info(query)
  }

  logQueryError(
    error: string,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    typeOrmLogger.error(query, error)
  }

  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    typeOrmLogger.info(query, time)
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    typeOrmLogger.info(message)
  }

  logMigration(message: string, queryRunner?: QueryRunner) {
    typeOrmLogger.info(message)
  }
  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner) {
    switch (level) {
      case 'info': {
        typeOrmLogger.info(message)
        break
      }
      case 'warn': {
        typeOrmLogger.warn(message)
      }
    }
  }
}
