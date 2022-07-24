import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Request as RequestType } from 'express';
import { MailConfirmationService } from 'src/mail/mailConfirmation.service';
import { User } from 'src/users/schemas/user.schema';
import { AuthService } from './auth.service';
import {
  EmailTokenRequest,
  LoginRequest,
  RegisterRequest,
} from './dto/requests.dto';
import { LoginResponse } from './dto/responses.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private mailConfirmationService: MailConfirmationService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req: RequestType & { user: User },
    @Body() _body: LoginRequest,
  ): Promise<LoginResponse> {
    return this.authService.createTokens(req.user);
  }

  @Post('register')
  async register(@Body() credentials: RegisterRequest): Promise<void> {
    return this.authService.registerUser(credentials);
  }

  @Get('confirm-email')
  async decodeToken(@Query() query: EmailTokenRequest): Promise<LoginResponse> {
    const email = await this.mailConfirmationService.getEmailFromToken(
      query.token,
    );
    const user = await this.mailConfirmationService.confirmEmail(email);
    return this.authService.createTokens(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('resend-confirm-email')
  async resendEmailConfirmLink(
    @Request() req: Request & { user: User },
  ): Promise<void> {
    this.authService.sendVerificationLink(req.user.email);
    return;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('accessToken')
  @Post('logout')
  async getProfile(@Request() req): Promise<void> {
    return this.authService.saveEmptyRefreshToken(req.user.userId);
  }

  @UseGuards(JwtRefreshGuard)
  @ApiBearerAuth('refreshToken')
  @Post('refresh')
  async refresh(@Request() req): Promise<LoginResponse> {
    return this.authService.compareRefreshToken(
      req.user.refreshToken,
      req.user.userId,
    );
  }
}
