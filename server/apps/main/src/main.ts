import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { swaggerOptions } from './config/swaggerOptions';
import { config } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { Callback, Context, Handler } from 'aws-lambda';

import { MainModule } from './main.module';
import serverlessExpress from '@vendia/serverless-express';
import { commonConfig } from '@app/config/config/appConfiguration';
import { MongoExceptionFilter } from '@app/config/filters/mongo-exception.filter';

let server: Handler;
declare const module: any;

const local = process.env.NODE_ENV === 'local';

console.log('ENV api', JSON.stringify(process.env));

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(MainModule, { bufferLogs: true });
  if (local) {
    app.setGlobalPrefix('api/main');
  }
  const configService = app.get(ConfigService);

  app.useGlobalFilters(new MongoExceptionFilter());
  commonConfig(app, configService);

  config.update({
    accessKeyId: configService.get('aws.accessKeyId'),
    secretAccessKey: configService.get('aws.secretAccessKey'),
    region: configService.get('aws.region'),
    signatureVersion: 'v4',
  });

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

  if (local) {
    await app.listen(3000);
    return;
  }

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  await app.init();
  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

if (local) bootstrap();

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};
