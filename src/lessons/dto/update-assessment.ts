import { IsNotEmpty, IsNumber } from "class-validator";

export class UpdateAssessmentDto {
  @IsNotEmpty()
  markId: string;

  @IsNotEmpty()
  @IsNumber()
  mark: number;
}