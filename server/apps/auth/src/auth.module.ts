import { BootstrapConfigModule, MongooseConnectModule } from '@app/config';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [BootstrapConfigModule, MongooseConnectModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
