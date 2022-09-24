import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';

import {
  CreateArticleDto,
  UpdateArticleDto,
  FindAll,
} from './dto/requests.dto';

import { FilesService } from '@app/common';
import ArticlesRepository from './articles.repository';
import { Article } from '@app/common/shared/shared/schemas/article.schema';
import { Status } from '@app/common/shared/shared/statuses/status.enum';
import { PublicFile } from '@app/common/shared/shared/schemas/publicFile.schema';
import { LazyModuleLoader } from '@nestjs/core';
import { getKeysFromString } from '@app/common/shared/shared/helper/cast.helper';
import { ConfigService } from '@nestjs/config';
import { FileStatus } from '@app/common/shared/shared/statuses/fileStatus.enum';

@Injectable()
export class ArticlesService {
  private readonly logger = new Logger(ArticlesService.name);
  private filesService: FilesService;

  constructor(
    private lazyModuleLoader: LazyModuleLoader,
    private readonly articlesRepository: ArticlesRepository,
    private readonly configService: ConfigService,
  ) {}

  async lazyInit(): Promise<void> {
    if (this.filesService) return;

    const { CommonFilesModule } = await import(
      '../../../../libs/common/src/files/commonFiles.module'
    );
    let moduleRef;
    try {
      moduleRef = await this.lazyModuleLoader.load(() => CommonFilesModule);
    } catch (error) {
      this.logger.log(error);
    }
    const { FilesService } = await import(
      '../../../../libs/common/src/files/files.service'
    );
    this.filesService = await moduleRef.get(FilesService);
  }

  async create(
    createArticleDto: CreateArticleDto,
    userId: string,
  ): Promise<Article> {
    return this.articlesRepository.create({
      ...createArticleDto,
      author: userId,
    });
  }

  async findAll(
    params: FindAll,
    userId?: string,
  ): Promise<{ articles: Article[]; count: string }> {
    this.logger.log({ params, userId }, 'findAll');
    return this.articlesRepository.findAll(params, userId);
  }

  async findBySlug(slug: string): Promise<Article> {
    return this.articlesRepository.findBySlug(slug);
  }

  async findOneToEdit(id: string, userId: string): Promise<Article> {
    const article = await this.articlesRepository.findOneWithStatus(
      id,
      Status.NowEditing,
      userId,
    );

    if (article?.editor.toString() !== userId) {
      throw new ConflictException();
    }

    return article;
  }

  async update(
    id: string,
    updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    const bucketRegion = this.configService.get('aws.bucketUrlRegion');
    await this.lazyInit();
    const keys = getKeysFromString(updateArticleDto.content, bucketRegion);
    if (keys?.length) {
      const statusUpdated = await this.filesService.changeStatus(
        keys,
        FileStatus.Processed,
      );
      if (!statusUpdated) {
        throw new BadRequestException();
      }
    }
    const oldValue = await this.articlesRepository.update(
      id,
      updateArticleDto,
      Status.NotEditing,
    );

    if (!oldValue) {
      throw new ConflictException();
    }

    const oldKeys = getKeysFromString(oldValue.content, bucketRegion);

    const keysToDelete = [];

    oldKeys.forEach((k) => {
      if (!keys?.includes(k)) keysToDelete.push(k);
    });

    if (keysToDelete.length) {
      await this.filesService.changeStatus(keysToDelete, FileStatus.Delete);
    }

    return oldValue;
  }

  async remove(id: string): Promise<void> {
    const result = await this.articlesRepository.remove(id);
    if (!result) {
      throw new ConflictException();
    }
    return;
  }

  async getAllSlugs(): Promise<{ slug: string }[]> {
    return this.articlesRepository.getAllSlugs();
  }

  async uploadImage(
    id: string,
    imageBuffer: Buffer,
    filename: string,
  ): Promise<PublicFile> {
    await this.lazyInit();
    const file = await this.filesService.uploadPublicFile(
      imageBuffer,
      filename,
      'articleImages',
    );

    // const oldUser = await this.usersRepository.updateAvatar(id, avatar);
    // if (oldUser.avatar) {
    //   await this.filesService.deletePublicFile(
    //     oldUser.avatar._id,
    //     oldUser.avatar.key,
    //   );
    // }
    return file;
  }

  async getUploadUrl(userId: string): Promise<unknown> {
    try {
      await this.lazyInit();
    } catch (error) {
      this.logger.log(error);
    }

    const presignedForm = await this.filesService.getUploadUrl(userId);
    return presignedForm;
  }
}
