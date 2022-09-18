import { Provider } from '@app/common/shared/shared/providers/providers.enum';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../../../src/users/users.service';
import { AuthService } from '../auth.service';
import { GoogleUser } from './dto/GoogleUser.dto';

@Injectable()
export class GoogleAuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  async authenticate(
    user: GoogleUser,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const userFromDb = await this.usersService.findOne(user.email);

    if (userFromDb) {
      if (!userFromDb.providers.includes(Provider.Google)) {
        await this.authService.registerUserWithProvider({
          email: user.email,
          provider: Provider.Google,
        });
      }
      return this.authService.createTokens(userFromDb);
    }
    const newUser = await this.authService.registerUserWithProvider({
      email: user.email,
      provider: Provider.Google,
    });
    return this.authService.createTokens({
      email: newUser.email,
      _id: newUser._id.toString(),
      emailIsConfirmed: true,
    });
  }
}
