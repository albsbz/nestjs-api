import { commonConfig } from '@app/config/config/appConfiguration';
import { MongoExceptionFilter } from '@app/config/filters/mongo-exception.filter';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import serverlessExpress from '@vendia/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';

import { BlogModule } from './blog.module';
declare const module: any;

let server: Handler;

const local = process.env.NODE_ENV === 'local';

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(BlogModule, { bufferLogs: true });
  if (local) {
    app.setGlobalPrefix('api/blog');
  }
  const configService = app.get(ConfigService);
  commonConfig(app, configService);
  app.useGlobalFilters(new MongoExceptionFilter());

  if (local) {
    await app.listen(3002);
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
