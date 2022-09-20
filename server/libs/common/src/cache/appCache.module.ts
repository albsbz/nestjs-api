import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheConfigModule } from '../cache-config/cache-config.module';
import { CacheConfigService } from '../cache-config/cache-config.service';
// import { AppCacheService } from './appCache.service';

@Module({
  imports: [
    ConfigModule,
    CacheConfigModule,
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
  ],
  providers: [],
  exports: [CacheModule],
})
export class AppCacheModule {}
