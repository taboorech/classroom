import { MethodNotAllowedException } from "@nestjs/common";
import { User } from "src/schemas/user.schema";

export function checkMember(classId: string, user: User, message: string) {
  if(!user.classes.find((userClass) => userClass.toString() == classId.toString())) {
    throw new MethodNotAllowedException(message);
  }
}