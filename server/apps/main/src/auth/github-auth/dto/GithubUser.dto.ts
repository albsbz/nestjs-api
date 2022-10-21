import { IsEmail, IsUrl } from 'class-validator';

export class GithubUser {
  @IsEmail()
  email: string;

  firstName: string;
  @IsUrl()
  picture: string;
  accessToken: string;
}
