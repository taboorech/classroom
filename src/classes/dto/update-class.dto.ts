import { Types } from 'mongoose';
import { IsOptional } from 'class-validator';

export class UpdateClassDto {
  @IsOptional()
  title: string;

  @IsOptional()
  owners: Types.ObjectId;
}