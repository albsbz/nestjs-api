import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticlesModule } from './articles/articles.module';
import { AuthModule } from './auth/auth.module';
import { RolesGuard } from './guards/roles.guard';
import { UsersModule } from './users/users.module';

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
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
