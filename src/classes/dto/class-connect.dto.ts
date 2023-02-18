import { IsNotEmpty } from 'class-validator';

export class ClassConnectDto {
  @IsNotEmpty()
  accessToken: string;
}