import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from '../roles/role.enum';
import * as bcrypt from 'bcrypt';
import { Schema as SchemaForTypes } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  _id: SchemaForTypes.Types.ObjectId;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true, set: hashPassword })
  password: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, default: [Role.User] })
  roles: Role[];
}

function hashPassword(v: string): Promise<string> {
  return bcrypt.hash(v, 10);
}
export const UserSchema = SchemaFactory.createForClass(User);
