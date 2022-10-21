import { Provider } from '@app/common/shared/shared/providers/providers.enum';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../../../src/users/users.service';
import { AuthService } from '../auth.service';
import { GithubUser } from './dto/GithubUser.dto';

@Injectable()
export class GithubAuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  async authenticate(
    user: GithubUser,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const userFromDb = await this.usersService.findOne(user.email);

    if (userFromDb) {
      if (!userFromDb.providers.includes(Provider.Google)) {
        await this.authService.registerUserWithProvider({
          email: user.email,
          provider: Provider.Github,
        });
      }
      return this.authService.createTokens(userFromDb);
    }
    const newUser = await this.authService.registerUserWithProvider({
      email: user.email,
      provider: Provider.Google,
      avatar: user.picture,
      firstName: user.firstName,
    });
    return this.authService.createTokens({
      email: newUser.email,
      _id: newUser._id.toString(),
      emailIsConfirmed: true,
    });
  }
}
