import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import cookieParser from 'cookie-parser'
import { ValidationPipe } from '@nestjs/common'
import { swaggerSetup } from './utils/swagger.util'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.use(cookieParser())

  app.useGlobalPipes(new ValidationPipe())

  swaggerSetup(app)

  await app.listen(process.env.PORT ?? 3000)
}

bootstrap()