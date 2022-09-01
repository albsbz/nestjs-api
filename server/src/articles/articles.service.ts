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

  async findAll(
    params: FindAll,
    userId?: string,
  ): Promise<{ articles: Article[]; count: string }> {
    const { take, skip, keyword } = params;

    const filter = {
      $and: [],
    };

    if (keyword) {
      filter.$and.push({
        $or: [
          {
            title: { $regex: keyword, $options: 'i' },
          },
          {
            content: { $regex: keyword, $options: 'i' },
          },
        ],
      });
    }

    if (userId) {
      const idFilter = { author: new Types.ObjectId(userId) };
      filter.$and.push(idFilter);
    }

    const articles = await this.articleModel.aggregate([
      {
        $facet: {
          totalData: [
            { $match: filter },
            { $skip: skip },
            { $limit: take },
            {
              $addFields: {
                _id: {
                  $toString: '$_id',
                },
              },
            },
            {
              $lookup: {
                from: 'users',
                localField: 'author',
                foreignField: '_id',
                as: 'author',
                pipeline: [
                  {
                    $project: {
                      name: 1,
                      'avatar.url': 1,
                      _id: {
                        $toString: '$_id',
                      },
                      about: 1,
                    },
                  },
                ],
              },
            },
            {
              $unwind: {
                path: '$author',
                preserveNullAndEmptyArrays: true,
              },
            },
          ],
          totalCount: [
            { $match: filter },
            {
              $count: 'count',
            },
          ],
        },
      },
    ]);

    return {
      articles: articles[0].totalData,
      count: articles[0].totalCount[0]?.count || 0,
    };
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
