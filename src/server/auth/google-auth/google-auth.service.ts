import { Injectable } from '@nestjs/common';
import { AuthService } from 'auth/auth.service';
import { UsersService } from 'users/users.service';

@Injectable()
export class GoogleAuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly authenticationService: AuthService,
  ) {}

  async authenticate(token: string): Promise<unknown> {
    return;
  }
}
