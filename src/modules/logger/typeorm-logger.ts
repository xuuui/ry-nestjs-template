import { QueryRunner } from 'typeorm'
import log4js from 'log4js'

export class TypeOrmLogger {
  private readonly logger: log4js.Logger

  constructor() {
    this.logger = log4js.getLogger('TypeOrm')
    this.logger.addContext('context', 'TypeOrm')
  }

  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    this.logger.info(query)
  }

  logQueryError(
    error: string,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    this.logger.error(query, error)
  }

  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    this.logger.info(query, time)
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    this.logger.info(message)
  }

  logMigration(message: string, queryRunner?: QueryRunner) {
    this.logger.info(message)
  }

  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner) {
    switch (level) {
      case 'info': {
        this.logger.info(message)
        break
      }
      case 'warn': {
        this.logger.warn(message)
      }
    }
  }
}
