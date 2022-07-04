import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

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
