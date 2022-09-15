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

import { Article } from '../common/schemas/article.schema';
import ArticlesRepository from './articles.repository';
import { PublicFile } from 'src/common/schemas/publicFile.schema';
import { FilesService } from 'src/files/files.service';
import { Status } from './statuses/status.enum';

@Injectable()
export class ArticlesService {
  private readonly logger = new Logger(ArticlesService.name);
  constructor(
    private readonly articlesRepository: ArticlesRepository,
    private readonly filesService: FilesService,
  ) {}

  create(createArticleDto: CreateArticleDto, userId: string): Promise<Article> {
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
    const statusUpdated = await this.filesService.changeStatus(
      updateArticleDto.content,
    );
    if (!statusUpdated) {
      throw new BadRequestException();
    }
    const result = await this.articlesRepository.update(
      id,
      updateArticleDto,
      Status.NotEditing,
    );

    if (!result) {
      throw new ConflictException();
    }

    return result;
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
}
