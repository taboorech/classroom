import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveMemberDto {
  @IsNotEmpty()
  @IsString()
  memberId: string;
}