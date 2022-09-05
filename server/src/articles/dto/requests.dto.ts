import {
  IsNotEmpty,
  Length,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

import * as sanitizeHtml from 'sanitize-html';

export class CreateArticleDto {
  @IsNotEmpty()
  @Length(3, 256)
  @IsString()
  @Matches(/^[a-zA-Z0-9\s\,\?\'\-\.]*$/, {
    message: 'No symbols in description',
  })
  title: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }): string => sanitizeHtml(value))
  content: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 512)
  @Matches(/^[a-zA-Z0-9\s\,\?\'\-\.]*$/, {
    message: 'No symbols in description',
  })
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
