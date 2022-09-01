import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Article, ArticleDocument } from 'src/common/schemas/article.schema';
import { FindAll, UpdateArticleDto } from './dto/requests.dto';
import { Model, Types } from 'mongoose';

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

  async update(
    id: string,
    updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    return this.articleModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      updateArticleDto,
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

  async findBySlug(slug: string): Promise<Article> {
    return this.articleModel
      .findOne({ slug })
      .populate('author', '_id nickname avatar')
      .lean();
  }
  async getAllSlugs(): Promise<{ slug: string }[]> {
    return this.articleModel.find({}, 'slug -_id');
  }
}

export default ArticlesRepository;
