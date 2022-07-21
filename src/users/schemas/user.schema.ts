import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Transform } from 'class-transformer';
import { Role } from '../roles/role.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Transform(({ value }) => value.toString())
  _id: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  @Exclude()
  password: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: false })
  emailIsConfirmed: boolean;

  @Prop({ required: true, default: [Role.User] })
  roles: Role[];

  @Prop()
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
