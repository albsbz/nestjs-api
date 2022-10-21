import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';

import { ConfigService } from '@nestjs/config';

import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { UsersModule } from '../users/users.module';
import { MailModule } from '../mail/mail.module';
import { GoogleAuthController } from './google-auth/google-auth.controller';
import { GoogleAuthService } from './google-auth/google-auth.service';
import { GoogleOAuthStrategy } from './strategies/google-OAuth.strategy';
import { JwtStrategy } from '@app/common/shared/shared/strategies/jwt.strategy';
import { GithubAuthController } from './github-auth/github-auth.controller';
import { GithubAuthService } from './github-auth/github-auth.service';
import { GithubOAuthStrategy } from './strategies/github-OAuth.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('jwtConstants.accessSecret'),
        signOptions: {
          expiresIn: configService.get('jwtConstants.accessTokenExpiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
    MailModule,
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    GoogleOAuthStrategy,
    GithubOAuthStrategy,
    GoogleAuthService,
    GithubAuthService,
  ],
  controllers: [AuthController, GoogleAuthController, GithubAuthController],
})
export class AuthModule {}
