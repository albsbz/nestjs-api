import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserResponseDto } from 'src/users/dto/responses.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterRequest } from './dto/requests.dto';
import { MailConfirmationService } from 'src/mail/mailConfirmation.service';
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

    if (user && (await bcrypt.compare(pass, user.password))) {
      delete user.password;
      return user;
    }
    return null;
  }

  async registerUser({ email, password }: RegisterRequest): Promise<void> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.createUser(email, hashedPassword);

    if (!user) {
      throw new ConflictException('User already exists');
    }
    await this.mailConfirmationService.sendVerificationLink(email);
    return;
  }

  async createTokens(user: {
    email: string;
    _id: string;
  }): Promise<{ accessToken: string; refreshToken: string }> {
    const accessTokenPayload = {
      email: user.email,
      sub: user._id,
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
