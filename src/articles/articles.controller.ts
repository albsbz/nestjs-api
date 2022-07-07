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
import { CreateArticleDto } from './dto/create-article.dto';
import { FindAll } from './dto/find-all.dto';
import { GetId } from './dto/getId';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './schemas/article.schema';

@Controller('articles')
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
