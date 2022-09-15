import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from 'nestjs-pino';
import { ArticlesModule } from './articles/articles.module';
import { AuthModule } from './auth/auth.module';
import { RolesGuard } from './guards/roles.guard';
import { UsersModule } from './users/users.module';
import { MailModule } from './mail/mail.module';
import configuration from './config/configuration';

import { FilesModule } from './files/files.module';
import { CacheConfigModule } from './cache-config/cache-config.module';
import { SqsModule } from './sqs/sqs.module';

const envFilePath = `.env.${process.env.NODE_ENV}`;

const loggerConfig = (configService: ConfigService): unknown => ({
  pinoHttp: {
    customProps: (): object => ({
      context: 'HTTP',
    }),
    transport: {
      target: configService.get('env') === 'local' ? 'pino-pretty' : undefined,
      options: {
        singleLine: true,
      },
    },
  },
});

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

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('db.mongoUrl'),
        dbName: configService.get('env'),
      }),
      inject: [ConfigService],
    }),

    ArticlesModule,
    AuthModule,
    UsersModule,
    MailModule,
    FilesModule,
    CacheConfigModule,
    SqsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
