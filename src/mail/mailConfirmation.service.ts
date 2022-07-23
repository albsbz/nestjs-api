import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MailService } from './mail.service';

@Injectable()
export class MailConfirmationService {
  constructor(
    private configService: ConfigService,
    private mailService: MailService,
    private jwtService: JwtService,
  ) {}

  public sendVerificationLink(email: string): Promise<void> {
    const token = this.jwtService.sign(
      { email },
      {
        secret: this.configService.get('emailConstants.emailTokenSecret'),
        expiresIn: this.configService.get('emailConstants.emailTokenExpiresIn'),
      },
    );

    const url = `${this.configService.get(
      'emailConstants.emailConfirmationUrl',
    )}?token=${token}`;

    const text = `Welcome to the application. To confirm the email address, click here: ${url}`;

    return this.mailService.sendMail({
      from: this.configService.get('emailConstants.emailSender'),
      to: email,
      subject: 'Email confirmation',
      text,
    });
  }
}
