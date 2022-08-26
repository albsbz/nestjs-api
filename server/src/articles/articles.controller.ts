import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto, FindAll } from './dto/requests.dto';
import { GetId } from '../common/dto/requests.dto';
import { UpdateArticleDto } from './dto/requests.dto';
import { Article } from '../common/schemas/article.schema';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import MongooseClassSerializerInterceptor from 'src/common/interceptors/mongooseClassSerializer.interceptor';
import { User } from 'src/common/schemas/user.schema';
import RequestWithJWT from 'src/common/interfaces/RequestWithJWT';

@Controller('api/articles')
@ApiTags('articles')
@UseInterceptors(MongooseClassSerializerInterceptor(User))
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createArticleDto: CreateArticleDto,
    @Request() req: RequestWithJWT,
  ): Promise<Article> {
    return this.articlesService.create(createArticleDto, req.user.userId);
  }

  @Get()
  findAll(@Query() query: FindAll): Promise<Article[]> {
    return this.articlesService.findAll(query);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  findAllMy(
    @Query() query: FindAll,
    @Request() req: RequestWithJWT,
  ): Promise<Article[]> {
    return this.articlesService.findAll(query, req.user.userId);
  }

  @Get(':id')
  findOne(@Param() params: GetId): Promise<Article> {
    const { id } = params;
    return this.articlesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param() params: GetId,
    @Body() updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    const { id } = params;
    return this.articlesService.update(id, updateArticleDto);
  }

  @Delete(':id')
  remove(@Param() params: GetId): Promise<void> {
    const { id } = params;
    return this.articlesService.remove(id);
  }
}
