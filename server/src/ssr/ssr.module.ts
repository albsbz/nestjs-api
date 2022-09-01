import { Module } from '@nestjs/common';
import { ArticlesController } from 'src/articles/articles.controller';
import { ArticlesModule } from 'src/articles/articles.module';
import { SsrController } from './ssr.controller';

@Module({
  imports: [ArticlesModule],
  controllers: [SsrController],
  providers: [ArticlesController],
})
export class SsrModule {}
