import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { FilesService } from '@app/common';
import { JwtAuthGuard } from '@app/common/shared/shared/guards/jwt-auth.guard';
import RequestWithJWT from '@app/common/shared/shared/interfaces/RequestWithJWT';

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
