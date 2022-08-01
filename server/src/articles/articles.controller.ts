import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto, FindAll } from './dto/requests.dto';
import { GetId } from '../common/dto/requests.dto';
import { UpdateArticleDto } from './dto/requests.dto';
import { Article } from './schemas/article.schema';
import { ApiTags } from '@nestjs/swagger';

@Controller('api/articles')
@ApiTags('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  create(@Body() createArticleDto: CreateArticleDto): Promise<Article> {
    return this.articlesService.create(createArticleDto);
  }

  @Get()
  findAll(@Query() query: FindAll): Promise<Article[]> {
    return this.articlesService.findAll(query);
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
