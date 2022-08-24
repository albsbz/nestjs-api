import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import mongoose, { Document } from 'mongoose';
import { User } from './user.schema';

export type ArticleDocument = Article & Document;

@Schema()
export class Article {
  @Transform(({ value }) => value.toString())
  _id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  @Type(() => User)
  author: User;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
