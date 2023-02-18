import { MethodNotAllowedException } from "@nestjs/common";
import { Class } from "src/schemas/class.schema";

export function checkOwner(classObj: Class, userId: string, message: string) {
  if(!classObj.owners.find(({_id}) => _id.toString() == userId.toString())) {
    throw new MethodNotAllowedException(message);
  }
}