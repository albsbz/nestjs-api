import { Role } from '../roles/role.enum';

export class UserResponseDto {
  username: string;
  email: string;
  roles: Role[];
}
