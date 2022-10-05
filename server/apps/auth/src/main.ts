import { Env } from '@app/common/shared/shared/enums/env.enum';
import { commonConfig } from '@app/config/config/appConfiguration';
import { MongoExceptionFilter } from '@app/config/filters/mongo-exception.filter';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import serverlessExpress from '@vendia/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';
import { AuthModule } from './auth.module';

declare const module: any;

let server: Handler;

const local = process.env.NODE_ENV === Env.Local;

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(AuthModule, { bufferLogs: true });
  if (local) {
    app.setGlobalPrefix('api/auth');
  }
  const configService = app.get(ConfigService);
  commonConfig(app, configService);
  app.useGlobalFilters(new MongoExceptionFilter());

  if (local) {
    await app.listen(3002);
    return;
  }

  if (module.hot && process.env.LOCAL_DEBUG) {
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
  context.callbackWaitsForEmptyEventLoop = false;
  console.log('handler', event, context);
  server = server ?? (await bootstrap());
  console.log('bootstrap...auth');
  return server(event, context, callback);
};
