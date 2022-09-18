import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { CommonFilesModule } from '@app/common';

@Module({
  imports: [CommonFilesModule],
  providers: [],
  controllers: [FilesController],
  exports: [],
})
export class FilesModule {}
