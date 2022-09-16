import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ArticlesModule } from './articles/articles.module';
import { AuthModule } from './auth/auth.module';
import { RolesGuard } from './guards/roles.guard';
import { UsersModule } from './users/users.module';
import { MailModule } from './mail/mail.module';

import { FilesModule } from './files/files.module';
import { CacheConfigModule } from './cache-config/cache-config.module';
import { SqsModule } from './sqs/sqs.module';
import { CommonModule } from '@app/common';
import { MongooseConnectModule } from '@app/common/mongooseConnect.module';

@Module({
  imports: [
    CommonModule,
    MongooseConnectModule,
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
export class MainModule {}
