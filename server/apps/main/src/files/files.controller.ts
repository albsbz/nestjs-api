import { Controller, Get, Request, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../../src/auth/guards/jwt-auth.guard';
import RequestWithJWT from '../../src/common/interfaces/RequestWithJWT';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('upload-url')
  @UseGuards(JwtAuthGuard)
  async getUploadUrl(@Request() req: RequestWithJWT): Promise<unknown> {
    const presignedForm = await this.filesService.getUploadUrl(req.user.userId);
    return presignedForm;
  }
}
