import { IsNotEmpty, Length } from 'class-validator';

export class CreateArticleDto {
  @IsNotEmpty()
  @Length(3, 256)
  title: string;

  @IsNotEmpty()
  content: string;
}
