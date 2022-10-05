import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { connection, Connection } from 'mongoose';

const mongooseConnection = {
  provide: 'MongooseConnection',
  useFactory: (): Connection => connection,
};

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        if (connection.readyState) {
          console.log('connectionExist', connection.readyState);
          await connection.asPromise();
          return connection;
        }
        return {
          uri: configService.get('db.mongoUrl'),
          dbName: configService.get('env'),
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [mongooseConnection],
  exports: [mongooseConnection, MongooseModule],
})
export class MongooseConnectModule {}
