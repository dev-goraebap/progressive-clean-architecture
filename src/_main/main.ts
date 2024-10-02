import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MainModule } from './main.module';
import { WinstonModule } from 'nest-winston';
import { winstonInstance } from 'src/shared/winston';

async function bootstrap() {
  const app = await NestFactory.create(MainModule, {
    logger: WinstonModule.createLogger({ instance: winstonInstance })
  });
  app.enableVersioning();

  const config = new DocumentBuilder()
    .setTitle('PCA')
    .setDescription('progressive clean architecture')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(8000);
}
bootstrap();
