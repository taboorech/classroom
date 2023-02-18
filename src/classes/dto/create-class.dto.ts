import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateClassDto {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  description: string;
}