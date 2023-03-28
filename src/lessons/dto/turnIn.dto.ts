import { IsArray, IsEnum, IsOptional, IsString } from "class-validator";
import { Operation } from "../operation.enum";

export class TurnInDto {
  @IsOptional()
  attachedElements: string;
}

export class TurnInOperationDto {
  @IsEnum(Operation)
  operation: Operation;
}