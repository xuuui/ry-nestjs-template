import { AppConfig } from '@/config/types'
import { ConfigService } from '@nestjs/config'
import { ServeStaticModule } from '@nestjs/serve-static'
import { ensureDirSync } from 'fs-extra'
import { join } from 'path'

export function setupServeStatic() {
  return ServeStaticModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => {
      const staticRoot = config.get<AppConfig>('app').staticRoot
      const rootPath = join(staticRoot)
      ensureDirSync(rootPath)
      return [
        {
          rootPath,
          serveRoot: `/${staticRoot}`,
          serveStaticOptions: {
            index: false,
            maxAge: '1h',
          },
        },
      ]
    },
  })
}
