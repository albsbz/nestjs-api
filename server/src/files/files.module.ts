import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PublicFile,
  PublicFileSchema,
} from 'src/common/schemas/publicFile.schema';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { PublicFilesRepository } from './publicFiles.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PublicFile.name, schema: PublicFileSchema },
    ]),
  ],
  providers: [FilesService, PublicFilesRepository],
  controllers: [FilesController],
  exports: [FilesService],
})
export class FilesModule {}
