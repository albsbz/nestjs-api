import {
  Controller,
  Delete,
  Get,
  Param,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EmailConfirmationGuard } from '../auth/guards/email-confirmation.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetId } from '../common/dto/requests.dto';

import MongooseClassSerializerInterceptor from '../common/interceptors/mongooseClassSerializer.interceptor';

import { Role } from './roles/role.enum';
import { Roles } from './roles/roles.decorator';
import { User } from './schemas/user.schema';
import { UsersService } from './users.service';

@Controller('api/users')
@ApiTags('users')
@UseInterceptors(MongooseClassSerializerInterceptor(User))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiBearerAuth('accessToken')
  @UseGuards(EmailConfirmationGuard)
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req): Promise<User> {
    return req.user;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  remove(@Param() params: GetId): Promise<void> {
    const { id } = params;
    return this.usersService.remove(id);
  }
}
