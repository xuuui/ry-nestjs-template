import { toCamelCase } from '@/utils/func'
import { Inject } from '@nestjs/common'

export const prefixesForLoggers: string[] = []

export function InjectLogger(prefix = '') {
  prefix = toCamelCase(prefix)
  if (!prefixesForLoggers.includes(prefix)) {
    prefixesForLoggers.push(prefix)
  }
  return Inject(`${prefix}Logger`)
}
