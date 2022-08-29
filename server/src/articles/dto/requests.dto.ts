import {
  IsNotEmpty,
  Length,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

export class CreateArticleDto {
  @IsNotEmpty()
  @Length(3, 256)
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-z]+(?:-[a-z]+)*$/, {
    message: 'slug should contain only letters and dashes',
  })
  slug: string;
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
