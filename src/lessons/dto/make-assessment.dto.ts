import { IsNotEmpty, IsNumber } from "class-validator";

export class MakeAssessmentDto {
  @IsNotEmpty()
  memberId: string;

  @IsNotEmpty()
  @IsNumber()
  mark: number;
}