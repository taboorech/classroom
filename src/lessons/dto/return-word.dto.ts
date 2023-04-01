import { IsNotEmpty } from "class-validator";

export class ReturnWorkDto {
  @IsNotEmpty()
  memberId: string;
}