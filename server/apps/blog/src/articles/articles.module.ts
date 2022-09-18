import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import ArticlesRepository from './articles.repository';

import {
  Article,
  ArticleSchema,
} from '@app/common/shared/shared/schemas/article.schema';
import { CommonFilesModule } from '@app/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from '@app/common/shared/shared/strategies/jwt.strategy';
import {
  User,
  UserSchema,
} from '@app/common/shared/shared/schemas/user.schema';

@Module({
  imports: [
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
    CommonFilesModule,
  ],
  controllers: [ArticlesController],
  providers: [ArticlesService, ArticlesRepository, JwtStrategy],
  exports: [ArticlesService],
})
export class ArticlesModule {}
