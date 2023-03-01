import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserCreateDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  login: string;

  @IsNotEmpty()
  surname: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  password: string;
}