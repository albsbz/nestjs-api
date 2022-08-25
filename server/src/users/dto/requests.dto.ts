import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class PatchProfileDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  about?: string;
}
