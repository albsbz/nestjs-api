import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';

export type PublicFileDocument = PublicFile & Document;

@Schema()
export class PublicFile {
  @Transform(({ value }) => value.toString())
  _id: string;

  @Prop()
  url: string;

  @Prop()
  key: string;
}

export const PublicFileSchema = SchemaFactory.createForClass(PublicFile);
