import { IsNotEmpty, Length, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

export class CreateArticleDto {
  @IsNotEmpty()
  @Length(3, 256)
  title: string;

  @IsNotEmpty()
  content: string;
}

export class FindAll {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly skip: number = 0;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly take: number = 5;

  @IsOptional()
  @Type(() => String)
  readonly keyword: string = '';
}

export class UpdateArticleDto extends PartialType(CreateArticleDto) {}
