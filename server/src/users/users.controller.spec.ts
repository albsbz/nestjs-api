import { Test } from '@nestjs/testing';
import { PublicFile } from 'src/common/schemas/publicFile.schema';

import { FilesModule } from 'src/files/files.module';

import { UsersController } from './users.controller';

import { UsersService } from './users.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';

import { connect, Connection, Model } from 'mongoose';
import { BadRequestException } from '@nestjs/common';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;
  let mongoConnection: Connection;

  beforeAll(async () => {
    mongoConnection = (await connect(globalThis.__MONGO_URI__)).connection;
    const moduleMocker = new ModuleMocker(global);

    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
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

    usersService = moduleRef.get<UsersService>(UsersService);
    usersController = moduleRef.get<UsersController>(UsersController);
  });

  afterAll(async () => {
    await mongoConnection.close();
  });

  describe('addAvatar', () => {
    const req = {
      user: {
        userId: 'sample.id',
      },
    };
    const file = {
      originalname: 'sample.name',
      mimetype: 'sample.type',
      path: 'sample.url',
      buffer: Buffer.from('whatever'),
    } as Express.Multer.File;

    it('should return avatar url', async () => {
      const result = { url: 'abc' } as PublicFile;
      jest
        .spyOn(usersService, 'addAvatar')
        .mockImplementation(async () => result);

      expect(await usersController.addAvatar(req, file)).toEqual(result);
    });
    it('should throw 400 exception on error', async () => {
      jest.spyOn(usersService, 'addAvatar').mockRejectedValue(new Error());
      await expect(usersController.addAvatar(req, file)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
