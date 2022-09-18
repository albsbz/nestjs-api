import { BootstrapConfigModule } from '@app/config';
import { MongooseConnectModule } from '@app/config/mongooseConnect.module';
import { Module } from '@nestjs/common';
import { ArticlesModule } from './articles/articles.module';

@Module({
  imports: [BootstrapConfigModule, MongooseConnectModule, ArticlesModule],
})
export class BlogModule {}
