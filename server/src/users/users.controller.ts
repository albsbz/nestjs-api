import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EmailConfirmationGuard } from '../auth/guards/email-confirmation.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetId } from '../common/dto/requests.dto';
import { Express } from 'express';

import MongooseClassSerializerInterceptor from '../common/interceptors/mongooseClassSerializer.interceptor';

import { Role } from './roles/role.enum';
import { Roles } from './roles/roles.decorator';
import { User } from '../common/schemas/user.schema';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/users')
@ApiTags('users')
// @UseInterceptors(MongooseClassSerializerInterceptor(User))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @UseInterceptors(MongooseClassSerializerInterceptor(User))
  @Get('profile')
  @ApiBearerAuth('accessToken')
  // @UseGuards(EmailConfirmationGuard)
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req): Promise<User> {
    return this.usersService.findById(req.user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  remove(@Param() params: GetId): Promise<void> {
    const { id } = params;
    return this.usersService.remove(id);
  }

  @Post('avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async addAvatar(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ url: string }> {
    let savedFile;
    try {
      savedFile = await this.usersService.addAvatar(
        req.user.userId,
        file.buffer,
        file.originalname,
      );
    } catch (e) {
      throw new BadRequestException(e);
    }
    return { url: savedFile.url };
  }
}
