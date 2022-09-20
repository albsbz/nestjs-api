import { MongooseConnectModule } from '@app/config';
import { CacheModule, forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { ArticlesModule } from 'apps/blog/src/articles/articles.module';
import { Schema, connection } from 'mongoose';
import { CacheConfigModule } from './cache-config/cache-config.module';
import { CacheConfigService } from './cache-config/cache-config.service';
// import { AppCacheModule } from './cache/appCache.module';

import { FilesService } from './files.service';
import { PublicFilesRepository } from './publicFiles.repository';
import {
  PublicFile,
  PublicFileSchema,
} from './shared/schemas/publicFile.schema';

@Module({
  imports: [
    forwardRef(() => ArticlesModule),
    // MongooseModule,
    // MongooseConnectModule,
    // MongooseModule.forFeatureAsync([
    //   {
    //     name: PublicFile.name,
    //     imports: [forwardRef(() => ArticlesModule)],
    //     useFactory: (): Schema<PublicFile> => PublicFileSchema,
    //     inject: [],
    //   },
    // ]),
    // MongooseModule.forRootAsync({
    //   imports: [ArticlesModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     uri: configService.get('db.mongoUrl'),
    //     dbName: configService.get('env'),
    //   }),
    //   connectionName: 'main',
    // }),
    // MongooseModule.forFeature(
    //   [{ name: PublicFile.name, schema: PublicFileSchema }],
    //   'main',
    // ),
    // // AppCacheModule,
    // // ConfigService,
    ConfigModule,
    CacheModule.registerAsync({
      imports: [CacheConfigModule, ConfigModule],
      useExisting: CacheConfigService,
      inject: [ConfigService],
    }),
  ],
  providers: [FilesService, PublicFilesRepository],
  exports: [FilesService],
})
export class CommonFilesModule {}
