import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticlesModule } from './articles/articles.module';
import { AuthModule } from './auth/auth.module';
import { RolesGuard } from './guards/roles.guard';
import { UsersModule } from './users/users.module';
import { MailModule } from './mail/mail.module';
import configuration from './config/configuration';
import { BullModule } from '@nestjs/bull';
import { RenderModule } from 'nest-next';
import { SsrModule } from './ssr/ssr.module';
import Next from 'next';
import { resolve } from 'path';
@Module({
  imports: [
    RenderModule.forRootAsync(
      Next({ dev: true, dir: resolve(__dirname, '../../ui') }),
      { viewsDir: null, passthrough404: true },
    ),
    MongooseModule.forRoot(process.env.MONGO_URL),
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('redis.host'),
          port: Number(configService.get('redis.port')),
        },
      }),
      inject: [ConfigService],
    }),
    ArticlesModule,
    AuthModule,
    UsersModule,
    MailModule,
    SsrModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
