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

import { Express } from 'express';

import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { PatchProfileDTO, UploadAvatarDTO } from './dto/requests.dto';
import MongooseClassSerializerInterceptor from '@app/common/shared/shared/interceptors/mongooseClassSerializer.interceptor';
import { JwtAuthGuard } from '@app/common/shared/shared/guards/jwt-auth.guard';
import { User } from '@app/common/shared/shared/schemas/user.schema';
import RequestWithJWT from '@app/common/shared/shared/interfaces/RequestWithJWT';
import { Roles } from '@app/common/shared/shared/roles/roles.decorator';
import { Role } from '@app/common/shared/shared/roles/role.enum';
import { GetId } from '@app/common/shared/shared/dto/requests.dto';

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
  async addAvatar(
    @Request() req,
    @Body() avatar: UploadAvatarDTO,
  ): Promise<void> {
    try {
      await this.usersService.addAvatar(req.user.userId, avatar.key);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
