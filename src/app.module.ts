import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesModule } from './articles/articles.module';

@Module({
  imports: [
    ArticlesModule,
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb://root:example@localhost:27017/?authMechanism=DEFAULT',
      autoLoadEntities: true,
      useUnifiedTopology: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
