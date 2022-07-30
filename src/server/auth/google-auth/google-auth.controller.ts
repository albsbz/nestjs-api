import { Controller, UseGuards, Get, Req } from '@nestjs/common';
import { GoogleOauthGuard } from 'auth/guards/google-oauth.guard';
import { GoogleAuthService } from './google-auth.service';

@Controller('api')
export class GoogleAuthController {
  constructor(
    private readonly googleAuthenticationService: GoogleAuthService,
  ) {}

  @Get('google-auth')
  @UseGuards(GoogleOauthGuard)
  async googleAuth(): Promise<void> {}

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async google(@Req() req): Promise<void> {
    return req.user;
  }
}
