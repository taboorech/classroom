import { BadRequestException } from "@nestjs/common";
import mongoose from "mongoose";

export function validLessonId(classId: string, lessonId: string, message: string) {
  if(!mongoose.Types.ObjectId.isValid(classId) || !mongoose.Types.ObjectId.isValid(lessonId)) {
    throw new BadRequestException(message);
  }
}