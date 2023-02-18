import { BadRequestException } from "@nestjs/common";
import mongoose from "mongoose";

export function validClassId(classId: string, message: string) {
  if(!mongoose.Types.ObjectId.isValid(classId)) {
    throw new BadRequestException(message);
  }
}