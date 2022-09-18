import { User } from '@app/common/shared/shared/schemas/user.schema';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { MailService } from './mail.service';

@Injectable()
export class MailConfirmationService {
  constructor(
    private configService: ConfigService,
    private mailService: MailService,
    private jwtService: JwtService,
    private usersService: UsersService,
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
  public async getEmailFromToken(token: string): Promise<string> {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('emailConstants.emailTokenSecret'),
      });
      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error instanceof Error && error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }

    return;
  }

  public async confirmEmail(email: string): Promise<User> {
    const user = await this.usersService.confirmEmail(email);
    if (!user) {
      throw new BadRequestException('Email already confirmed');
    }
    return user;
  }
}
