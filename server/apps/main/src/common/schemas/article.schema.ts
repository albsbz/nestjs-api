import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Transform, Type } from 'class-transformer';
import mongoose, { Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { Status } from '../../../src/articles/statuses/status.enum';
import { PublicFile, PublicFileSchema } from './publicFile.schema';
import { User } from './user.schema';

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

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  @Type(() => User)
  editor: User;

  @Prop({ required: true, default: Status.NotEditing })
  status: Status;

  @Prop()
  editedAt: Date;

  @Prop({ type: PublicFileSchema })
  @Type(() => PublicFile)
  images: PublicFile[];
}

export const ArticleSchema =
  SchemaFactory.createForClass(Article).plugin(uniqueValidator);
