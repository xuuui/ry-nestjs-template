import log4js from 'log4js'
import util from 'util'
import dayjs from 'dayjs'
import chalk from 'chalk'
import log4jConfig from './log4j.config'

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
  let moduleOutput: string = `[Nest] `
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

log4js.addLayout('console', () => {
  return (logEvent: log4js.LoggingEvent): string => {
    return customLayout(logEvent, true)
  }
})

log4js.addLayout('file', () => {
  return (logEvent: log4js.LoggingEvent): string => {
    return customLayout(logEvent)
  }
})

// 配置
log4js.configure(log4jConfig)

export function getLogger(context: string): log4js.Logger {
  return log4js.getLogger(context)
}
