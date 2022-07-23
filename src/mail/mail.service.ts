import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';

@Injectable()
export class MailService {
  private nodemailerTransport: Mail;
  constructor(private configService: ConfigService) {
    const options = {
      // service: configService.get('emailConstants.emailService'),
      auth: {
        user: configService.get('emailConstants.emailUser'),
        pass: configService.get('emailConstants.emailPassword'),
      },
      port: configService.get('emailConstants.emailPort'),
      host: configService.get('emailConstants.emailHost'),
      secure: configService.get('emailConstants.emailSecure'),
    };

    this.nodemailerTransport = createTransport(options);
  }

  sendMail(options: Mail.Options): Promise<void> {
    return this.nodemailerTransport.sendMail(options);
  }
}
