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
  NotFoundException,
  ConflictException,
  UploadedFile,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto, FindAll } from './dto/requests.dto';

import { UpdateArticleDto } from './dto/requests.dto';

import { ApiTags } from '@nestjs/swagger';

import { FileInterceptor } from '@nestjs/platform-express';
import MongooseClassSerializerInterceptor from '@app/common/shared/shared/interceptors/mongooseClassSerializer.interceptor';
import { JwtAuthGuard } from '@app/common/shared/shared/guards/jwt-auth.guard';
import { Article } from '@app/common/shared/shared/schemas/article.schema';
import RequestWithJWT from '@app/common/shared/shared/interfaces/RequestWithJWT';
import { GetId } from '@app/common/shared/shared/dto/requests.dto';

@Controller('articles')
@ApiTags('articles')
@UseInterceptors(MongooseClassSerializerInterceptor(Article))
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}
  private readonly logger = new Logger(ArticlesController.name);
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createArticleDto: CreateArticleDto,
    @Request() req: RequestWithJWT,
  ): Promise<Article> {
    this.logger.log(
      { createArticleDto, user: req.user.userId },
      'createArticles',
    );
    return this.articlesService.create(createArticleDto, req.user.userId);
  }

  @Get()
  findAll(
    @Query() query: FindAll,
  ): Promise<{ articles: Article[]; count: string }> {
    return this.articlesService.findAll(query);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  findAllMy(
    @Query() query: FindAll,
    @Request() req: RequestWithJWT,
  ): Promise<{ articles: Article[]; count: string }> {
    return this.articlesService.findAll(query, req.user.userId);
  }

  @Get('edit/:id')
  @UseGuards(JwtAuthGuard)
  async findOneToEdit(
    @Param() params: GetId,
    @Request() req: RequestWithJWT,
  ): Promise<Article> {
    const { id } = params;
    const article = await this.articlesService.findOneToEdit(
      id,
      req.user.userId,
    );
    if (!article) {
      throw new NotFoundException();
    }
    return article;
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

  @Get(':slug')
  async findOneBySlug(@Param('slug') slug: string): Promise<Article> {
    const article = await this.articlesService.findBySlug(slug);
    if (!article) throw new NotFoundException();
    return article;
  }

  @Post('slugs')
  async getAllSlugs(): Promise<{ slug: string }[]> {
    const slugs = await this.articlesService.getAllSlugs();
    if (!slugs) throw new ConflictException();
    return slugs;
  }

  @Post('image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async addImages(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ url: string }> {
    let savedFile;
    try {
      savedFile = await this.articlesService.uploadImage(
        req.articleId,
        file.buffer,
        file.originalname,
      );
    } catch (e) {
      throw new BadRequestException(e);
    }
    return { url: savedFile.url };
  }
}
