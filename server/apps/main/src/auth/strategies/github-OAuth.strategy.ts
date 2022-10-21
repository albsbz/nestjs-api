import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-github2';
import { GithubUser } from '../github-auth/dto/GithubUser.dto';

@Injectable()
export class GithubOAuthStrategy extends PassportStrategy(
  Strategy,
  'githubOAuth',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get('github.auth.clientId'),
      clientSecret: configService.get('github.auth.clientSecret'),
      callbackURL: `${configService.get('url')}/auth/provider?provider=github`,
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done,
  ): Promise<void> {
    const { username, emails, photos } = profile;
    const user: GithubUser = {
      email: emails[0].value,
      firstName: username,
      picture: photos[0].value,
      accessToken,
    };

    done(null, user);
  }
}
