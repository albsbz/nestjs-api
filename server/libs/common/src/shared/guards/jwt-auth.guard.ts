import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);
  handleRequest<TUser>(err, user: TUser, info): TUser {
    this.logger.log({ err, user, info }, 'JwtAuthGuard');
    if (err || !user) {
      throw err || new UnauthorizedException(info.message);
    }
    return user;
  }
}
