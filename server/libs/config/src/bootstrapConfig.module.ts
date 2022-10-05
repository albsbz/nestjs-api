import { Env } from '@app/common/shared/shared/enums/env.enum';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import configuration from './config/configuration';

const envFilePath = `.env.${process.env.NODE_ENV || Env.Local}`;

const loggerConfig = async (configService: ConfigService): Promise<unknown> => {
  return {
    pinoHttp: {
      // customProps: (): object => ({
      //   context: 'HTTP',
      // }),
      transport:
        !Env.Production || configService.get('localDebug')
          ? {
              target: 'pino-pretty',
              options: {
                singleLine: true,
                colorize: true,
              },
            }
          : undefined,
    },
  };
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath,
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: loggerConfig,
      inject: [ConfigService],
    }),
  ],
  providers: [],
  exports: [ConfigModule],
})
export class BootstrapConfigModule {}
