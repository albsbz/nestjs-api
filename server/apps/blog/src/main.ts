import { commonConfig } from '@app/common/config/appConfiguration';
import { MongoExceptionFilter } from '@app/common/filters/mongo-exception.filter';
import { NestFactory } from '@nestjs/core';
import serverlessExpress from '@vendia/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';
import { ConfigService } from 'aws-sdk';
import { BlogModule } from './blog.module';

let server: Handler;

const local = process.env.NODE_ENV === 'local';

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(BlogModule, { bufferLogs: true });
  const configService = app.get(ConfigService);
  commonConfig(app, configService);
  app.useGlobalFilters(new MongoExceptionFilter());

  if (local) {
    await app.listen(4000);
    return;
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
