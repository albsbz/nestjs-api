import { Module } from '@nestjs/common';
import { SsrController } from './ssr.controller';

@Module({
  controllers: [SsrController],
})
export class SsrModule {}
