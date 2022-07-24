import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { MailService } from './mail.service';
import { MailConfirmationService } from './mailConfirmation.service';

@Module({
  providers: [MailService, MailConfirmationService],
  imports: [ConfigModule, JwtModule, UsersModule],
  exports: [MailService, MailConfirmationService],
})
export class MailModule {}
