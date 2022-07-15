import { ObjectId } from 'mongoose';
import { Role } from '../roles/role.enum';

export class UseResponseDto {
  _id: ObjectId;
  username: string;
  email: string;
  roles: Role[];
}
