import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { swaggerOptions } from './config/swaggerOptions';
import { RenderService } from 'nest-next';
import { config } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

async function bootstrap(): Promise<void> {
  const server = await NestFactory.create(AppModule);
  const configService = server.get(ConfigService);
  const policies = {
    'script-src': ['self', configService.get('url')],
    'img-src': [
      'self',
      configService.get('aws.bucketUrlRegion'),
      configService.get('aws.bucketUrl'),
    ],
  };
  if (process.env.NODE_ENV !== 'production') {
    policies['script-src'].push("'unsafe-eval'");
  }
  server.use(
    helmet({
      contentSecurityPolicy: {
        directives: policies,
      },
      crossOriginEmbedderPolicy: false,
    }),
  );

  const service = server.get(RenderService);
  service.setErrorHandler(async (err, req, res) => {
    if (res.statusCode !== 404) {
      res.send(err.response);
      return;
    }
  });

  config.update({
    accessKeyId: configService.get('aws.accessKeyId'),
    secretAccessKey: configService.get('aws.secretAccessKey'),
    region: configService.get('aws.region'),
  });

  server.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: true,
    }),
  );

  // server.useGlobalInterceptors(
  //   new ClassSerializerInterceptor(server.get(Reflector)),
  // );
  const swaggerConfig = new DocumentBuilder()
    .setTitle('blog-api')
    .setDescription('blog-api description')
    .setVersion('1.0')
    .addTag('blog-api')
    .addBearerAuth(undefined, 'accessToken')
    .addBearerAuth(undefined, 'refreshToken')
    .build();
  const document = SwaggerModule.createDocument(server, swaggerConfig);
  SwaggerModule.setup('api', server, document, swaggerOptions);
  await server.listen(3000);
}
bootstrap();
