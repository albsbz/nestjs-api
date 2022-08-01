import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
@Injectable()
export class GoogleOauthGuard extends AuthGuard('googleOAuth') {
  constructor() {
    super({
      prompt: 'select_account',
    });
  }
}
