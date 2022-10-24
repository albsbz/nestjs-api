import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleOneTapStrategy as Strategy } from 'passport-google-one-tap';
import { GoogleUser } from '../google-auth/dto/GoogleUser.dto';

@Injectable()
export class GoogleOneTapStrategy extends PassportStrategy(
  Strategy,
  'google-one-tap',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get('google.auth.clientId'),
      clientSecret: configService.get('google.auth.clientSecret'),
      verifyCsrfToken: false,
    });
  }

  async validate(profile: any, done: any): Promise<void> {
    const { name, emails, photos } = profile;
    const user: GoogleUser = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
    };

    done(null, user);
  }
}
