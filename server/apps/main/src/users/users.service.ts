import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UsersRepository } from './users.repository';

import { FilesService } from '@app/common';
import { Provider } from '@app/common/shared/shared/providers/providers.enum';
import { User } from '@app/common/shared/shared/schemas/user.schema';
import { PublicFile } from '@app/common/shared/shared/schemas/publicFile.schema';
import { LazyModuleLoader } from '@nestjs/core';
import { FileStatus } from '@app/common/shared/shared/statuses/fileStatus.enum';

@Injectable()
export class UsersService {
  private filesService: FilesService;
  constructor(
    private lazyModuleLoader: LazyModuleLoader,
    private readonly usersRepository: UsersRepository,
    private configService: ConfigService,
  ) {}

  async lazyInit(): Promise<void> {
    if (this.filesService) return;

    const { CommonFilesModule } = await import(
      '../../../../libs/common/src/files/commonFiles.module'
    );
    const moduleRef = await this.lazyModuleLoader.load(() => CommonFilesModule);

    const { FilesService } = await import(
      '../../../../libs/common/src/files/files.service'
    );
    this.filesService = moduleRef.get(FilesService);
  }
  private passwordWithPrefix(password): string {
    return `${this.configService.get('db.mongoPasswordPrefix')}_${password}`;
  }

  async createLocalUser(
    email: string,
    password: string,
    provider: Provider,
  ): Promise<boolean> {
    return this.usersRepository.createLocalUser(
      email,
      this.passwordWithPrefix(password),
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

  public async updatePassword(id: string, newPassword: string): Promise<User> {
    return this.usersRepository.updatePassword(
      id,
      this.passwordWithPrefix(newPassword),
    );
  }

  public async addAvatar(id: string, key: string): Promise<void> {
    await this.lazyInit();
    const url = `${this.configService.get('aws.bucketUrlRegion')}/${key}`;
    const oldUser = await this.usersRepository.updateAvatar(id, { url, key });
    if (oldUser.avatar) {
      await this.filesService.deletePublicFile(oldUser.avatar.key);
    }
    await this.filesService.changeStatus([key], FileStatus.Processed);
    return;
  }

  public async updateProfile(
    id: string,
    profileData: { about: string; name: string },
  ): Promise<User> {
    return await this.usersRepository.updateProfile(id, profileData);
  }
}
