import { BootstrapConfigModule, MongooseConnectModule } from '@app/config';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheConfigModule } from '../cache-config/cache-config.module';
import { CacheConfigService } from '../cache-config/cache-config.service';

import { FilesService } from './files.service';
import { PublicFilesRepository } from './publicFiles.repository';

@Module({
  imports: [
    MongooseConnectModule,
    BootstrapConfigModule,
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
