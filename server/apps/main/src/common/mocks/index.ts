import { Provider } from '../../../src/users/providers/providers.enum';
import { Role } from '../../../src/users/roles/role.enum';
import { PublicFile } from '../schemas/publicFile.schema';
import { User } from '../schemas/user.schema';

export const PublicFileMock: PublicFile = {
  _id: 'id',
  url: 'url',
  key: 'key',
};

export const UserMock: User = {
  _id: 'id',
  password: 'password',
  email: 'email',
  emailIsConfirmed: true,
  roles: [Role.User],
  providers: [Provider.Google],
  refreshToken: 'token',
  avatar: PublicFileMock,
};
