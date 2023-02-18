import { IsArray, IsEnum, IsOptional, IsString } from "class-validator";
import { LessonType } from "../lesson-type.enum";

export class UpdateLessonDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsEnum(LessonType)
  type: LessonType;

  @IsOptional()
  @IsArray()
  attachedElements: string[];

  @IsOptional()
  @IsString()
  expires: string;
}