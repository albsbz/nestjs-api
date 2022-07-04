import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { FindAll } from './dto/find-all.dto';
import { GetId } from './dto/getId';
import { UpdateArticleDto } from './dto/update-article.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articlesService.create(createArticleDto);
  }

  @Get()
  findAll(@Query() query: FindAll) {
    return this.articlesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param() params: GetId) {
    const { id } = params;
    return this.articlesService.findOne(id);
  }

  @Patch(':id')
  update(@Param() params: GetId, @Body() updateArticleDto: UpdateArticleDto) {
    const { id } = params;
    return this.articlesService.update(id, updateArticleDto);
  }

  @Delete(':id')
  remove(@Param() params: GetId) {
    const { id } = params;
    return this.articlesService.remove(id);
  }
}
