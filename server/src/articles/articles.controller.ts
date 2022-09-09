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
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/articles')
@ApiTags('articles')
@UseInterceptors(MongooseClassSerializerInterceptor(User))
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createArticleDto: CreateArticleDto,
    @Request() req: RequestWithJWT,
  ): Promise<Article> {
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
