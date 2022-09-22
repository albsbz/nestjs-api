import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { RolesGuard } from './guards/roles.guard';
import { UsersModule } from './users/users.module';
import { MailModule } from './mail/mail.module';
import { SqsModule } from './sqs/sqs.module';
import { BootstrapConfigModule } from '@app/config';
import { MongooseConnectModule } from '@app/config/mongooseConnect.module';
// import { CacheConfigModule } from '@app/common/shared/cache-config/cache-config.module';

@Module({
  imports: [
    BootstrapConfigModule,
    MongooseConnectModule,
    // CacheConfigModule,
    // FilesModule,
    AuthModule,
    UsersModule,
    MailModule,
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
