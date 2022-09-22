import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@app/common/shared/shared/guards/jwt-auth.guard';
import RequestWithJWT from '@app/common/shared/shared/interfaces/RequestWithJWT';
import { ArticlesService } from './articles.service';

@Controller('files')
export class FilesController {
  constructor(private articlesService: ArticlesService) {}

  @Get('upload-url')
  @UseGuards(JwtAuthGuard)
  async getUploadUrl(@Request() req: RequestWithJWT): Promise<unknown> {
    return this.articlesService.getUploadUrl(req.user.userId);
  }
}
