import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ClsMiddleware } from 'nestjs-cls'
import { AppModule } from './app/app.module'
import requestIp from 'request-ip'
import compression from 'compression'
import xmlparser from 'express-xml-bodyparser'
import { Log4jLoggerService } from './modules/logger/log4j-logger.service'
import { ConfigService } from '@nestjs/config'
import { HTTP_HEADER_TOKEN } from './common/constants/sys'
import { ParseQueryJsonPipe } from './common/pipes/parse-query-json.pipe'
import { AppService } from './app/app.service'
import { getLocalIp, getNanoid } from './utils/func'
import { getEnv } from './utils/env'
import fileUpload from 'express-fileupload'

const setupSwagger = (app: NestExpressApplication) => {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('接口文档')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'apiKey',
      in: 'header',
      name: HTTP_HEADER_TOKEN,
    })
    .build()
  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup(`/docs`, app, document)
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  })
  const logger = app.get(Log4jLoggerService)
  app.useLogger(logger)

  const config = app.get<ConfigService>(ConfigService)
  const apiPrefix = config.get<string>('app.apiPrefix')

  // 跨域设置
  app.enableCors({
    origin: '*',
    allowedHeaders: '*',
    preflightContinue: false,
    credentials: true,
  })

  // 管道转换
  app.useGlobalPipes(
    new ParseQueryJsonPipe(),
    new ValidationPipe({
      transform: true,
      whitelist: false,
      skipNullProperties: true,
      transformOptions: {
        excludeExtraneousValues: true,
        exposeUnsetFields: false,
        enableImplicitConversion: true,
      },
    }),
  )

  // 中间件
  app.use(
    new ClsMiddleware({
      generateId: true,
      idGenerator: () => getNanoid(),
      saveReq: true,
      saveRes: true,
      useEnterWith: true,
    }).use,
  )
  app.use(requestIp.mw())
  app.use(compression())
  app.use(xmlparser())
  app.use(
    fileUpload({
      defParamCharset: 'utf8',
      limits: { fileSize: 3 * 1024 * 1024 },
    }),
  )

  // swagger
  setupSwagger(app)

  const port = config.get<number>('app.port')
  const localIp = getLocalIp()
  await app.listen(port).then(async () => {
    logger.log(`当前环境：${getEnv()}`, 'NestApplication')
    logger.log(
      `IP: ${await app.get(AppService).getPublicIp()}`,
      'NestApplication',
    )
    logger.log(`DOMAIN: ${config.get<string>('app.domain')}`, 'NestApplication')
    logger.log(
      `api文档地址:
                - Local:   http://localhost:${port}/docs
                - Network: http://${localIp}:${port}/docs
            `,
      'NestApplication',
    )
    logger.log(
      `服务已经启动:
                - Local:   http://localhost:${port}/${apiPrefix}
                - Network: http://${localIp}:${port}/${apiPrefix}
            `,
      'NestApplication',
    )
  })
}
bootstrap()
