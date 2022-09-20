import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('db.mongoUrl'),
        dbName: configService.get('env'),
        connectionFactory: (connetion): unknown => {
          return connetion;
        },
      }),
      inject: [ConfigService],
      connectionName: 'main',
    }),
  ],
  providers: [],
  exports: [],
})
export class MongooseConnectModule {}
