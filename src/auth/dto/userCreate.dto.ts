import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserCreateDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  login: string;

  @IsNotEmpty()
  password: string;
}