import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { Article, ArticleSchema } from '../common/schemas/article.schema';
import { MongooseModule } from '@nestjs/mongoose';
import ArticlesRepository from './articles.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
  ],
  controllers: [ArticlesController],
  providers: [ArticlesService, ArticlesRepository],
  exports: [ArticlesService],
})
export class ArticlesModule {}
