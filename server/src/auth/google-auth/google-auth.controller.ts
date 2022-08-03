import { Controller, UseGuards, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { LoginResponse } from '../dto/responses.dto';
import { GoogleOauthGuard } from '../guards/google-oauth.guard';
import { GoogleUser } from './dto/GoogleUser.dto';

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
  async google(
    @Req() req: Request & { user: GoogleUser },
  ): Promise<LoginResponse> {
    const jwtToken = await this.googleAuthenticationService.authenticate(
      req.user,
    );
    if (jwtToken) {
      return jwtToken;
    }

    return;
  }
}
