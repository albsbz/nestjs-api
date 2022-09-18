import { Role } from '@app/common/shared/shared/roles/role.enum';

export class UserResponseDto {
  email: string;
  roles: Role[];
}
