import { CommonModule } from '@app/common';
import { MongooseConnectModule } from '@app/common/mongooseConnect.module';
import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';

@Module({
  imports: [CommonModule, MongooseConnectModule],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
