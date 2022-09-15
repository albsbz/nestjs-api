import { Module } from '@nestjs/common';
import { CacheConfigService } from './cache-config.service';

@Module({
  providers: [CacheConfigService],
})
export class CacheConfigModule {}
