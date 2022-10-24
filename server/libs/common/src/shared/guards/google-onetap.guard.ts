import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
@Injectable()
export class GoogleOneTapGuard extends AuthGuard('google-one-tap') {
  handleRequest<TUser>(err, user: TUser): TUser {
    if (err) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
