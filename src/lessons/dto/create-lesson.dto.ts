import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { LessonType } from "../lesson-type.enum";

export class CreateLessonDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsEnum(LessonType)
  type: LessonType;

  @IsOptional()
  maxMark: number;

  @IsOptional()
  attachedElements: string[];

  @IsOptional()
  @IsString()
  expires: string;
}