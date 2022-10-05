import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import ArticlesRepository from './articles.repository';

import {
  Article,
  ArticleSchema,
} from '@app/common/shared/shared/schemas/article.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from '@app/common/shared/shared/strategies/jwt.strategy';
import {
  User,
  UserSchema,
} from '@app/common/shared/shared/schemas/user.schema';

import { FilesController } from './files.controller';
import { MongooseConnectModule } from '@app/config';

@Module({
  imports: [
    MongooseConnectModule,
    MongooseModule.forFeature([
      { name: Article.name, schema: ArticleSchema },
      { name: User.name, schema: UserSchema },
    ]),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('jwtConstants.accessSecret'),
        signOptions: {
          expiresIn: configService.get('jwtConstants.accessTokenExpiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [ArticlesController, FilesController],
  providers: [ArticlesService, ArticlesRepository, JwtStrategy],
  exports: [ArticlesService, MongooseModule],
})
export class ArticlesModule {}
