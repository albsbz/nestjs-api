import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from 'src/common/schemas/article.schema';

@Injectable()
class ArticlesRepository {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
  ) {}

  async create(params): Promise<Article> {
    return this.articleModel.create(params);
  }
}

export default ArticlesRepository;
