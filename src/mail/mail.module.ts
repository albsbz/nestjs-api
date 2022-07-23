import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MailService } from './mail.service';
import { MailConfirmationService } from './mailConfirmation.service';

@Module({
  providers: [MailService, MailConfirmationService],
  imports: [ConfigModule, JwtModule],
  exports: [MailService, MailConfirmationService],
})
export class MailModule {}
