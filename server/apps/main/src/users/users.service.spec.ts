import { Test } from '@nestjs/testing';
import {
  PublicFile,
  PublicFileSchema,
} from 'src/common/schemas/publicFile.schema';
import { User, UserSchema } from 'src/common/schemas/user.schema';
import { FilesModule } from 'src/files/files.module';
import { UsersService } from './users.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { connect, Connection, Model } from 'mongoose';
import { FilesService } from 'src/files/files.service';
import { UsersRepository } from './users.repository';
import { PublicFileMock, UserMock } from 'src/common/mocks';

describe('UserService', () => {
  let mongoConnection: Connection;
  let userModel: Model<User>;
  let publicFileModel: Model<PublicFile>;
  let filesService: FilesService;
  let usersService: UsersService;
  let usersRepository: UsersRepository;

  beforeAll(async () => {
    mongoConnection = (await connect(globalThis.__MONGO_URI__)).connection;
    const moduleMocker = new ModuleMocker(global);

    userModel = mongoConnection.model(User.name, UserSchema);
    publicFileModel = mongoConnection.model(PublicFile.name, PublicFileSchema);
    const moduleRef = await Test.createTestingModule({
      providers: [UsersService],
      imports: [FilesModule],
    })
      .useMocker((token) => {
        if (token === 'DatabaseConnection') {
          return mongoConnection;
        }

        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();
    filesService = moduleRef.get<FilesService>(FilesService);
    usersService = moduleRef.get<UsersService>(UsersService);
    usersRepository = moduleRef.get<UsersRepository>(UsersRepository);
  });

  afterAll(async () => {
    await mongoConnection.close();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(UsersService).toBeDefined();
  });

  describe('addAvatar', () => {
    const params = {
      id: 'id',
      imageBuffer: Buffer.from('hello world', 'utf8'),
      filename: 'filename',
    };
    const avatar: PublicFile = PublicFileMock;
    const user: User = UserMock;

    let uploadPublicFileSpy;
    let updateAvatarSpy;
    let deletePunlicFileSpy;
    beforeEach(() => {
      uploadPublicFileSpy = jest.spyOn(filesService, 'uploadPublicFile');
      updateAvatarSpy = jest.spyOn(usersRepository, 'updateAvatar');
      deletePunlicFileSpy = jest.spyOn(filesService, 'deletePublicFile');
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('should return new avatar', async () => {
      uploadPublicFileSpy.mockImplementation(async () => {
        return avatar;
      });
      updateAvatarSpy.mockImplementation(async (): Promise<User> => {
        return user;
      });
      deletePunlicFileSpy.mockImplementation(async () => {
        return;
      });
      expect(
        await usersService.addAvatar(
          params.id,
          params.imageBuffer,
          params.filename,
        ),
      ).toEqual(avatar);
    });
    it('should delete old avatar if it exist', async () => {
      await usersService.addAvatar(
        params.id,
        params.imageBuffer,
        params.filename,
      );
      expect(deletePunlicFileSpy.mockImplementation()).toHaveBeenCalled();
    });

    it('should not delete old avatar if it not exist', async () => {
      updateAvatarSpy.mockImplementation(async (): Promise<User> => {
        const userWithNoAvatar = { ...user };
        userWithNoAvatar.avatar = null;
        return userWithNoAvatar;
      });
      await usersService.addAvatar(
        params.id,
        params.imageBuffer,
        params.filename,
      );
      expect(deletePunlicFileSpy.mockImplementation()).not.toHaveBeenCalled();
    });
  });
});
