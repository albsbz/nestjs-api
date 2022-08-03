import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Provider } from './providers/providers.enum';
import { User } from './schemas/user.schema';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private configService: ConfigService,
  ) {}

  async createLocalUser(
    email: string,
    password: string,
    provider: Provider,
  ): Promise<boolean> {
    const passwordWithPrefix = `${this.configService.get(
      'db.mongoPasswordPrefix',
    )}_${password}`;
    return this.usersRepository.createLocalUser(
      email,
      passwordWithPrefix,
      provider,
    );
  }

  async createProviderUser(email: string, provider: Provider): Promise<User> {
    return this.usersRepository.createProviderUser(email, provider);
  }

  async findOne(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  async remove(id: string): Promise<void> {
    const result = await this.usersRepository.remove(id);

    if (!result) {
      throw new NotFoundException();
    }
    return;
  }

  async setRefreshToken(refreshToken: string, userId: string): Promise<void> {
    const user = await this.usersRepository.update(userId, refreshToken);

    if (!user) {
      throw new NotFoundException('Unable to set refresh token');
    }
    return;
  }

  async updateRefreshTokenForUser(
    hashedRefreshToken: string,
    userId: string,
  ): Promise<void> {
    const user = await this.usersRepository.update(userId, hashedRefreshToken);
    if (!user) {
      throw new NotFoundException('Unable update refresh token');
    }
    return;
  }

  async findById(userId: string): Promise<User> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  public async confirmEmail(email: string): Promise<User> {
    return this.usersRepository.confirmEmail(email);
  }
}
