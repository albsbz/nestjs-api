import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
@Injectable()
export class GithubOauthGuard extends AuthGuard('githubOAuth') {
  handleRequest<TUser>(err, user: TUser): TUser {
    if (err) {
      console.log('GithubOauthGuard', err);

      throw new UnauthorizedException();
    }
    return user;
  }
}
