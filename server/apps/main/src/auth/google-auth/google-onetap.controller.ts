import { GoogleOneTapGuard } from '@app/common/shared/shared/guards/google-onetap.guard';
import { Controller, UseGuards, Get, Req, Post, Res } from '@nestjs/common';
import { Request, Response } from 'express';

import { GoogleUser } from './dto/GoogleUser.dto';

import { GoogleAuthService } from './google-auth.service';

@Controller('auth/google-one-tap')
export class GoogleOnetapAuthController {
  constructor(
    private readonly googleAuthenticationService: GoogleAuthService,
  ) {}

  @Post('login')
  @UseGuards(GoogleOneTapGuard)
  async google(@Req() req: Request & { user: GoogleUser }): Promise<unknown> {
    const jwtToken = await this.googleAuthenticationService.authenticate(
      req.user,
    );
    return jwtToken;
  }
}
