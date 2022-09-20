import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
@Injectable()
export class AppCacheService {
  public manager;
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    this.manager = cacheManager;
  }
}
