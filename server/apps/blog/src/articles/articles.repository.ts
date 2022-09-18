import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FindAll, UpdateArticleDto } from './dto/requests.dto';
import { Model, Types } from 'mongoose';
import {
  Article,
  ArticleDocument,
} from '@app/common/shared/shared/schemas/article.schema';
import { Status } from '@app/common/shared/shared/statuses/status.enum';

@Injectable()
class ArticlesRepository {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
  ) {}

  async create(params): Promise<Article> {
    return this.articleModel.create(params);
  }

  async findAll(
    params: FindAll,
    userId?: string,
  ): Promise<{ articles: Article[]; count: string }> {
    const { take, skip, keyword } = params;

    let filter =
      {
        $and: [],
      } || {};

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

    if (!filter.$and.length) filter = {};

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

  async update(
    id: string,
    updateArticleDto: UpdateArticleDto,
    status: Status,
  ): Promise<Article> {
    return this.articleModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      { ...updateArticleDto, status },
      {
        new: true,
      },
    );
  }

  async remove(id: string): Promise<void | Article> {
    return this.articleModel.findByIdAndDelete(id, { returnOriginal: true });
  }

  async findOne(id: string): Promise<Article> {
    return this.articleModel
      .findById(id)
      .populate('author', '_id nickname avatar');
  }

  async findOneWithStatus(
    id: string,
    status: Status,
    userId,
  ): Promise<Article> {
    const compareCondition = {
      $or: [
        {
          $ne: ['$status', Status.NowEditing], // no editor
        },
        {
          $eq: ['$editor', new Types.ObjectId(userId)], // i'am editor
        },
        {
          $and: [
            { eq: ['$status', Status.NowEditing] },
            {
              $gt: [
                // start editing more then 5 minutes ago
                {
                  $dateDiff: {
                    startDate: '$editedAt',
                    endDate: '$$NOW',
                    unit: 'minute',
                  },
                },
                1,
              ],
            },
          ],
        },
      ],
    };

    const article = await this.articleModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      [
        {
          $set: {
            editor: {
              $cond: [compareCondition, new Types.ObjectId(userId), '$editor'],
            },
            editedAt: {
              $cond: [compareCondition, '$$NOW', '$editedAt'],
            },
            status: {
              $cond: [compareCondition, Status.NowEditing, '$status'],
            },
          },
        },
      ],
      {
        new: true,
      },
    );

    return article;
  }

  async findBySlug(slug: string): Promise<Article> {
    return this.articleModel
      .findOne({ slug })
      .populate('author', '_id nickname avatar name about');
    // .lean();
  }
  async getAllSlugs(): Promise<{ slug: string }[]> {
    return this.articleModel.find({}, 'slug -_id');
  }
}

export default ArticlesRepository;
