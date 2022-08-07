import { Controller, UseGuards, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
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
    @Res() res: Response,
  ): Promise<void> {
    const jwtToken = await this.googleAuthenticationService.authenticate(
      req.user,
    );
    if (jwtToken) {
      const { accessToken, refreshToken } = jwtToken;
      res.header('accessToken', accessToken);
      res.header('refreshToken', refreshToken);
    }

    return res.redirect('/');
  }
}
