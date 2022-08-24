import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  CreateArticleDto,
  UpdateArticleDto,
  FindAll,
} from './dto/requests.dto';

import { Article, ArticleDocument } from '../common/schemas/article.schema';
import ArticlesRepository from './articles.repository';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
    private readonly artilesRepository: ArticlesRepository,
  ) {}

  create(createArticleDto: CreateArticleDto, userId: string): Promise<Article> {
    return this.artilesRepository.create({
      ...createArticleDto,
      author: userId,
    });
  }

  async findAll(params: FindAll): Promise<Article[]> {
    const { take, skip, keyword } = params;

    const search = { $regex: new RegExp(`${keyword}`, 'i') };

    const result = await this.articleModel.find(
      { $or: [{ title: search }, { content: search }] },
      null,
      {
        skip,
        limit: take,
      },
    );

    return result;
  }

  async findOne(id: string): Promise<Article> {
    return this.articleModel
      .findById(id)
      .populate('author', '_id nickname avatar');
  }

  async update(
    id: string,
    updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    const result = await this.articleModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      updateArticleDto,
      {
        new: true,
      },
    );

    if (!result) {
      throw new NotFoundException();
    }

    return result;
  }

  async remove(id: string): Promise<void> {
    const result = await this.articleModel.findByIdAndDelete(id);

    if (!result) {
      throw new NotFoundException();
    }
    return;
  }
}
