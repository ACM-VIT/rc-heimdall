import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as config from 'config';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /** configuring documentation builder */
  const options = new DocumentBuilder()
    .setTitle(config.get('api.name'))
    .setDescription(config.get('api.description'))
    .setVersion(config.get('api.version'))
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(config.get('api.route'), app, document);

  /** binding port to service */
  await app.listen(config.get('server.port'));
}
bootstrap();
