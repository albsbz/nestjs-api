import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bull';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';

@Injectable()
export class MailService {
  public nodemailerTransport: Mail;
  constructor(
    private configService: ConfigService,
    @InjectQueue('email') private emailQueue: Queue,
  ) {
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

  async sendMail(emailData: Mail.Options): Promise<void> {
    await this.emailQueue.add(emailData);
    return;
  }
}
