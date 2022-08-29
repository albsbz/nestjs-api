import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Transform, Type } from 'class-transformer';
import mongoose, { Document } from 'mongoose';
import { User } from './user.schema';
import * as uniqueValidator from 'mongoose-unique-validator';

export type ArticleDocument = Article & Document;

@Schema()
export class Article {
  // @Transform(({ value }) => value.toString())
  @Exclude()
  __v: string;

  @Transform((params) => {
    return params.obj._id.toString();
  })
  // @Transform(({ value }) => value.toString())
  _id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  @Type(() => User)
  author: User;
}

export const ArticleSchema =
  SchemaFactory.createForClass(Article).plugin(uniqueValidator);
