import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UseResponseDto } from 'src/users/dto/user-response.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<UseResponseDto> {
    const user = await this.usersService.findOne(username);

    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any): Promise<any> {
    const payload = { username: user.username, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
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
