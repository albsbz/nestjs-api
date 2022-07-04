import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, MongoRepository, Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { ObjectID } from 'mongodb';
import { FindAll } from './dto/find-all.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: MongoRepository<Article>,
  ) {}

  create(createArticleDto: CreateArticleDto): Promise<Article> {
    return this.articleRepository.save(createArticleDto);
  }

  async findAll(params: FindAll): Promise<{ data: Article[]; count: number }> {
    const { take, skip, keyword } = params;
    const search: any = { $regex: new RegExp(`.*${keyword}.*`) };

    const [result, total] = await this.articleRepository.findAndCount({
      where: { title: search },
      order: { title: 'DESC' },
      take: take,
      skip: skip,
    });

    return {
      data: result,
      count: total,
    };
  }

  findOne(id: string): Promise<Article> {
    return this.articleRepository.findOne(new ObjectID(id));
  }

  async update(id: string, updateArticleDto: UpdateArticleDto): Promise<void> {
    const { affected } = await this.articleRepository.update(
      new ObjectID(id),
      updateArticleDto,
    );
    if (!affected) {
      throw new NotFoundException();
    }
    return;
  }

  async remove(id: string): Promise<void> {
    const { affected } = await this.articleRepository.delete(new ObjectID(id));
    if (!affected) {
      throw new NotFoundException();
    }
    return;
  }
}
