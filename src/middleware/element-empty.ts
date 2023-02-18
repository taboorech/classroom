import { NotFoundException } from "@nestjs/common";
import { Lesson } from "src/schemas/lesson.schema";

export function elementEmptyValidatation(element: any, message: string) {
  if(!element) {
    throw new NotFoundException(message);
  }
}