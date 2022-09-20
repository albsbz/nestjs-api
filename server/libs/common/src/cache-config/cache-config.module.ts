import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheConfigService } from './cache-config.service';

@Module({
  imports: [ConfigModule],
  providers: [CacheConfigService, ConfigService],
  exports: [CacheConfigService],
})
export class CacheConfigModule {}
