import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { GoogleUser } from '../google-auth/dto/GoogleUser.dto';

@Injectable()
export class GoogleOAuthStrategy extends PassportStrategy(
  Strategy,
  'googleOAuth',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get('google.auth.clientId'),
      clientSecret: configService.get('google.auth.clientSecret'),
      callbackURL: `${configService.get('url')}/auth/provider?provider=google`,
      scope: ['email', 'profile'],
      prompt: 'select_account',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<void> {
    const { name, emails, photos } = profile;
    const user: GoogleUser = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
    };

    done(null, user);
  }
}
