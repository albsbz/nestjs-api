import { Module, CacheModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheConfigService } from '../../src/cache-config/cache-config.service';
import {
  PublicFile,
  PublicFileSchema,
} from '../../src/common/schemas/publicFile.schema';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { PublicFilesRepository } from './publicFiles.repository';

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
  controllers: [FilesController],
  exports: [FilesService],
})
export class FilesModule {}
