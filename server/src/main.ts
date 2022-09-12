import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { swaggerOptions } from './config/swaggerOptions';
import { config } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { Callback, Context, Handler } from 'aws-lambda';

import { MongoExceptionFilter } from './common/filters/mongo-exception.filter';
import { AppModule } from './app.module';
import serverlessExpress from '@vendia/serverless-express';

let server: Handler;

const development = process.env.NODE_ENV === 'dev';

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const policies = {
    defaultSrc: ["'self'", configService.get('aws.formActionUrl')],
    'form-action': ["'self'", configService.get('aws.formActionUrl')],
    'script-src': ["'self'", configService.get('url')],
    'img-src': [
      "'self'",
      'data:',
      configService.get('aws.bucketUrlRegion'),
      configService.get('aws.bucketUrl'),
    ],
  };
  if (process.env.NODE_ENV !== 'production') {
    policies['script-src'].push("'unsafe-eval'");
  }
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: policies,
      },
      crossOriginEmbedderPolicy: false,
    }),
  );

  config.update({
    accessKeyId: configService.get('aws.accessKeyId'),
    secretAccessKey: configService.get('aws.secretAccessKey'),
    region: configService.get('aws.region'),
    signatureVersion: 'v4',
  });

  app.useGlobalFilters(new MongoExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: true,
      exceptionFactory(errors): unknown {
        return new BadRequestException(
          errors.map((error) => ({
            name: error.property,
            errors: Object.entries(error.constraints).map(([_, v]) => v),
          })),
        );
      },
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('blog-api')
    .setDescription('blog-api description')
    .setVersion('1.0')
    .addTag('blog-api')
    .addBearerAuth(undefined, 'accessToken')
    .addBearerAuth(undefined, 'refreshToken')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document, swaggerOptions);
  // await app.listen(3000);

  if (development) {
    await app.listen(3000);
    return;
  }

  await app.init();
  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

if (development) bootstrap();

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};
