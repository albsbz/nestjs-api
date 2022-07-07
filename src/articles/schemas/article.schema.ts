import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CreateArticleDto } from '../dto/create-article.dto';

export type ArticleDocument = Article & Document;

@Schema()
export class Article {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);

ArticleSchema.methods.createArticle = function (
  createArticleDto: CreateArticleDto,
): Promise<Article> {
  return this.articleModel.create(createArticleDto);
};
