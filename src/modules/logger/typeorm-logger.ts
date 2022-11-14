import { QueryRunner } from 'typeorm'
import log4js from 'log4js'
import { TypeormConfig } from '@/core/interfaces/config'

export class TypeOrmLogger {
  private readonly logger: log4js.Logger

  constructor(private readonly config: TypeormConfig) {
    this.logger = log4js.getLogger('TypeOrm')
    this.logger.addContext('context', 'TypeOrm')
  }

  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    if (!this.config?.logging) return
    this.logger.info(query)
  }

  logQueryError(
    error: string,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    if (!this.config?.logging) return
    this.logger.error(query, error)
  }

  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    if (!this.config?.logging) return
    this.logger.info(query, time)
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    if (!this.config?.logging) return
    this.logger.info(message)
  }

  logMigration(message: string, queryRunner?: QueryRunner) {
    if (!this.config?.logging) return
    this.logger.info(message)
  }

  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner) {
    if (!this.config?.logging) return
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
