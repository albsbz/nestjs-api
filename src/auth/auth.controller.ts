import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { Request as RequestType } from 'express';
import { User } from 'src/users/schemas/user.schema';
import { AuthService } from './auth.service';
import { RegisterRequest } from './dto/requests.dto';
import { LoginResponse } from './dto/responses.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req: RequestType & { user: User },
  ): Promise<LoginResponse> {
    return this.authService.createTokens(req.user);
  }

  @Post('register')
  async register(@Body() credentials: RegisterRequest): Promise<void> {
    return this.authService.registerUser(credentials);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async getProfile(@Request() req): Promise<void> {
    return this.authService.saveEmptyRefreshToken(req.user.userId);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refresh(@Request() req): Promise<LoginResponse> {
    return this.authService.compareRefreshToken(
      req.user.refreshToken,
      req.user.userId,
    );
  }
}
