import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthService } from '../auth.service';

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
