import { ConflictException, Injectable } from '@nestjs/common';

import {
  CreateArticleDto,
  UpdateArticleDto,
  FindAll,
} from './dto/requests.dto';

import { Article } from '../common/schemas/article.schema';
import ArticlesRepository from './articles.repository';
import e from 'express';

@Injectable()
export class ArticlesService {
  constructor(private readonly articlesRepository: ArticlesRepository) {}

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
    return this.articlesRepository.findAll(params, userId);
  }

  async findBySlug(slug: string): Promise<Article> {
    return this.articlesRepository.findBySlug(slug);
  }

  async findOne(id: string): Promise<Article> {
    return this.articlesRepository.findOne(id);
  }

  async update(
    id: string,
    updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    const result = await this.articlesRepository.update(id, updateArticleDto);

    if (!result) {
      throw new ConflictException();
    }

    return result;
  }

  async remove(id: string): Promise<void> {
    const result = await this.articlesRepository.remove(id);
    console.log('result', result);

    if (!result) {
      throw new ConflictException();
    }
    return;
  }

  async getAllSlugs(): Promise<{ slug: string }[]> {
    return this.articlesRepository.getAllSlugs();
  }
}
