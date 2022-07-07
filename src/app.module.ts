import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticlesModule } from './articles/articles.module';

@Module({
  imports: [
    ArticlesModule,
    // TypeOrmModule.forRoot({
    //   type: 'mongodb',
    //   url: 'mongodb://root:example@localhost:27017/?authMechanism=DEFAULT',
    //   autoLoadEntities: true,
    //   useUnifiedTopology: true,
    // }),
    MongooseModule.forRoot(
      'mongodb://root:example@localhost:27017/?authMechanism=DEFAULT',
    ),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
