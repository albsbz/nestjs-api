import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Render,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ArticlesService } from 'src/articles/articles.service';
import { Article } from 'src/common/schemas/article.schema';

@Controller()
export class SsrController {
  constructor(private readonly articlesService: ArticlesService) {}
  // @Get('')
  // @Render('index')
  // home(): unknown {
  //   return {};
  // }

  // @Get('login')
  // @Render('login')
  // login(): unknown {
  //   return {};
  // }

  @Get('articles')
  @Render('articles')
  getArticles(): unknown {
    return { articles: 'articles1' };
  }

  // @Get('article/:slug')
  // async getArticle(
  //   @Param('slug') slug: string,
  //   @Res() res: Response,
  // ): Promise<void> {
  //   const article = await this.articlesService.findBySlug(slug);
  //   if (!article) throw new NotFoundException();
  //   console.log('slug', slug);

  //   return res.render(`article/${slug}`, { article });
  // }
}
