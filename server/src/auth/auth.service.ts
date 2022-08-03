import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { RegisterRequest } from './dto/requests.dto';
import { UserResponseDto } from '../users/dto/responses.dto';
import { UsersService } from '../users/users.service';
import { MailConfirmationService } from '../mail/mailConfirmation.service';
import { Provider } from 'src/users/providers/providers.enum';
import { User } from 'src/users/schemas/user.schema';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailConfirmationService: MailConfirmationService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<UserResponseDto | null> {
    const user = await this.usersService.findOne(email);
    const passwordWithouPrefix = user.password.split('_')?.[1];
    if (
      user &&
      passwordWithouPrefix &&
      (await bcrypt.compare(pass, passwordWithouPrefix)) &&
      user.providers.includes(Provider.Local)
    ) {
      delete user.password;
      return user;
    }
    return null;
  }

  async registerUser({
    email,
    password,
    provider,
  }: RegisterRequest & { provider: Provider }): Promise<void> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newlyCreatedUser = await this.usersService.createLocalUser(
      email,
      hashedPassword,
      provider,
    );

    if (!newlyCreatedUser) {
      throw new ConflictException('User already exists');
    }
    // this.sendVerificationLink(email);
    return;
  }

  async registerUserWithProvider({
    email,
    provider,
  }: {
    email: string;
    provider: Provider;
  }): Promise<User> {
    const user = await this.usersService.createProviderUser(email, provider);

    if (!user || typeof user === 'boolean') {
      throw new ConflictException('User already exists');
    }
    return user;
  }

  async sendVerificationLink(email: string): Promise<void> {
    return this.mailConfirmationService.sendVerificationLink(email);
  }

  async createTokens(user: {
    email: string;
    _id: string;
    emailIsConfirmed: boolean;
  }): Promise<{ accessToken: string; refreshToken: string }> {
    const accessTokenPayload = {
      email: user.email,
      sub: user._id,
      emailIsConfirmed: user.emailIsConfirmed,
      tokenType: 'access',
    };
    const refreshToken = this.jwtService.sign(
      { sub: user._id, tokenType: 'refresh' },
      {
        secret: this.configService.get('jwtConstants.refreshSecret'),
        expiresIn: this.configService.get('jwtConstants.refreshTokenExpiresIn'),
      },
    );
    await this.saveHashedRefreshToken(refreshToken, user._id);
    return {
      accessToken: this.jwtService.sign(accessTokenPayload),
      refreshToken,
    };
  }

  async saveHashedRefreshToken(
    refreshToken: string,
    userId: string,
  ): Promise<void> {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    return this.usersService.setRefreshToken(hashedRefreshToken, userId);
  }

  async saveEmptyRefreshToken(userId: string): Promise<void> {
    return this.usersService.setRefreshToken('', userId);
  }

  async compareRefreshToken(
    refreshToken: string,
    userId: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.usersService.findById(userId);
    const tokenValid = await bcrypt.compare(refreshToken, user.refreshToken);

    if (!tokenValid || !user.refreshToken) {
      throw new ForbiddenException('refresh token not valid');
    }
    const tokens = await this.createTokens(user);
    return tokens;
  }

  // async register(userDto: CreateUserDto): Promise<RegistrationStatus> {
  //   let status: RegistrationStatus = {
  //     success: true,
  //     message: 'user registered',
  //   };
  //   try {
  //     await this.usersService.create(userDto);
  //   } catch (err) {
  //     status = {
  //       success: false,
  //       message: err,
  //     };
  //   }
  //   return status;
  // }
}
