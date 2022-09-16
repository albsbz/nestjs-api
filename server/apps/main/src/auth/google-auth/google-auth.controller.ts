import { Controller, UseGuards, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { GoogleOauthGuard } from '../guards/google-oauth.guard';
import { GoogleUser } from './dto/GoogleUser.dto';

import { GoogleAuthService } from './google-auth.service';

@Controller('auth/google')
export class GoogleAuthController {
  constructor(
    private readonly googleAuthenticationService: GoogleAuthService,
  ) {}

  @Get()
  @UseGuards(GoogleOauthGuard)
  async googleAuth(): Promise<void> {}

  @Get('login')
  @UseGuards(GoogleOauthGuard)
  async google(@Req() req: Request & { user: GoogleUser }): Promise<unknown> {
    const jwtToken = await this.googleAuthenticationService.authenticate(
      req.user,
    );

    return jwtToken;
  }
}
