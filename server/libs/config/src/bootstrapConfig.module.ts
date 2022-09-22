import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import configuration from './config/configuration';

const envFilePath = `.env.${process.env.NODE_ENV || 'local'}`;

const loggerConfig = (configService: ConfigService): unknown => {
  const local = configService.get('env') === 'local';
  const dev = configService.get('env') === 'devlopment';
  return {
    pinoHttp: {
      customProps: (): object => ({
        context: 'HTTP',
      }),
      transport: {
        target: 'pino-pretty',
        options: {
          singleLine: !local || !dev,
          colorize: local,
        },
      },
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
