import { GoogleOauthGuard } from '@app/common/shared/shared/guards/google-oauth.guard';
import { Controller, UseGuards, Get, Req } from '@nestjs/common';
import { Request } from 'express';

import { GoogleUser } from './dto/GoogleUser.dto';

import { GoogleAuthService } from './google-auth.service';

@Controller('auth/google')
export class GoogleAuthController {
  constructor(
    private readonly googleAuthenticationService: GoogleAuthService,
  ) {}

  @Get()
  @UseGuards(GoogleOauthGuard)
  async googleAuth(): Promise<void> {
    1;
  }

  @Get('login')
  @UseGuards(GoogleOauthGuard)
  async google(@Req() req: Request & { user: GoogleUser }): Promise<unknown> {
    const jwtToken = await this.googleAuthenticationService.authenticate(
      req.user,
    );

    return jwtToken;
  }
}
