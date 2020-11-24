import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as config from 'config';
import * as rateLimit from 'express-rate-limit';

/** importing middlewares */
import * as helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'verbose'],
  });

  /** configuring documentation builder */
  const options = new DocumentBuilder()
    .setTitle(config.get('api.name'))
    .setDescription(config.get('api.description'))
    .setVersion(config.get('api.version'))
    .setContact('Yash Kumar Verma', 'https://yashkumarverma.github.io/', 'yk.verma2000@gmail.com')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(config.get('api.route'), app, document);

  /** attaching middleware */
  app.enableCors();
  app.use(helmet());

  /**
   * windowMs : time interval
   * max: number of requests
   *
   * this will allow max number of requests every windowMs seconds
   */
  app.use(
    rateLimit({
      windowMs: 1000 * 1,
      max: 1,
    }),
  );

  /** binding port to service */
  await app.listen(config.get('server.port'));
}
bootstrap();
