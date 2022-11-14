import { AppConfig } from '@/common/interfaces/config'
import { ConfigService } from '@nestjs/config'
import { ServeStaticModule } from '@nestjs/serve-static'
import { ensureDirSync } from 'fs-extra'
import { join } from 'path'

export function setupServeStatic() {
  return ServeStaticModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => {
      const appCfg = config.get<AppConfig>('app')
      const rootPath = join(appCfg.staticRoot)
      ensureDirSync(rootPath)
      return [
        {
          rootPath,
          serveRoot: `/${appCfg.staticRoot}`,
          serveStaticOptions: {
            index: false,
            maxAge: '1h',
          },
        },
      ]
    },
  })
}
