import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Transform, Type } from 'class-transformer';
import { Provider } from '../../users/providers/providers.enum';
import { Role } from '../../users/roles/role.enum';
import { PublicFile, PublicFileSchema } from './publicFile.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Transform(({ value }) => value.toString())
  _id: string;

  @Prop({ required: true })
  @Exclude()
  password: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false, unique: true })
  name?: string;

  @Prop({ required: false })
  about?: string;

  @Prop({ default: false })
  emailIsConfirmed: boolean;

  @Prop({ required: true, default: [Role.User] })
  roles: Role[];

  @Prop({ required: true })
  providers: Provider[];

  @Prop()
  @Exclude()
  refreshToken: string;

  @Prop({ type: PublicFileSchema })
  @Type(() => PublicFile)
  avatar: PublicFile;
}

export const UserSchema = SchemaFactory.createForClass(User);
