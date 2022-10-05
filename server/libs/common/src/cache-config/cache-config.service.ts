import mongoStore from 'cache-manager-mongodb';
import {
  CacheModuleOptions,
  CacheOptionsFactory,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
  constructor(private configService: ConfigService) {}
  createCacheOptions(): CacheModuleOptions {
    return {
      store: mongoStore,
      uri: this.configService.get('db.mongoUrl'),
      options: {
        collection: 'uploadUrl',
        compression: false,
        poolSize: 1,
        autoReconnect: true,
      },
    };
  }
}
