import { GithubOauthGuard } from '@app/common/shared/shared/guards/github-oauth.guard';
import { Controller, UseGuards, Get, Req } from '@nestjs/common';
import { Request } from 'express';

import { GithubUser } from './dto/GithubUser.dto';

import { GithubAuthService } from './github-auth.service';

@Controller('auth/github')
export class GithubAuthController {
  constructor(
    private readonly githubAuthenticationService: GithubAuthService,
  ) {}

  @Get()
  @UseGuards(GithubOauthGuard)
  async githubAuth(): Promise<void> {
    1;
  }

  @Get('login')
  @UseGuards(GithubOauthGuard)
  async github(@Req() req: Request & { user: GithubUser }): Promise<unknown> {
    const jwtToken = await this.githubAuthenticationService.authenticate(
      req.user,
    );

    return jwtToken;
  }
}
