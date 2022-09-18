import { CacheModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheConfigService } from './cache-config/cache-config.service';
import { FilesService } from './files.service';
import { PublicFilesRepository } from './publicFiles.repository';
import {
  PublicFile,
  PublicFileSchema,
} from './shared/schemas/publicFile.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PublicFile.name, schema: PublicFileSchema },
    ]),
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
  ],
  providers: [FilesService, PublicFilesRepository],
  exports: [FilesService],
})
export class CommonFilesModule {}
