import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';
import { join } from 'path';

import { ConfigService } from '@nestjs/config';
import { winstonInstance } from 'src/shared/logger';
import { MainModule } from './main.module';
import { EnvConfig } from './shared/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(MainModule, {
    logger: WinstonModule.createLogger({ instance: winstonInstance })
  });

  const configService = app.get(ConfigService<EnvConfig>);

  app.setBaseViewsDir(join(__dirname, '..', 'public')); // EJS 파일들이 있는 폴더 설정
  app.setViewEngine('ejs');

  app.setGlobalPrefix('api', {
    exclude: ['/']
  });
  app.enableVersioning();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  )

  const config = new DocumentBuilder()
    .setTitle('PCA')
    .setDescription('progressive clean architecture')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = configService.get('APP_PORT');
  await app.listen(port, () => Logger.log(`[${port}] 서버가 시작되었습니다.`));
}
bootstrap();
