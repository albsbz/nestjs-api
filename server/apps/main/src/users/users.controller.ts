import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
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
import { Request as RequestType } from 'express';

import MongooseClassSerializerInterceptor from '../common/interceptors/mongooseClassSerializer.interceptor';

import { Role } from './roles/role.enum';
import { Roles } from './roles/roles.decorator';
import { User } from '../common/schemas/user.schema';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { PatchProfileDTO } from './dto/requests.dto';
import RequestWithJWT from '../../src/common/interfaces/RequestWithJWT';

@Controller('users')
@ApiTags('users')
@UseInterceptors(MongooseClassSerializerInterceptor(User))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiBearerAuth('accessToken')
  // @UseGuards(EmailConfirmationGuard)
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req): Promise<User> {
    return this.usersService.findById(req.user.userId);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  async update(
    @Body() profile: PatchProfileDTO,
    @Request() req: RequestWithJWT,
  ): Promise<User> {
    return this.usersService.updateProfile(req.user.userId, {
      about: profile.about,
      name: profile.name,
    });
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
