import { Class } from "src/schemas/class.schema"
import { Marks } from "src/schemas/marks.schema";

export type GradeBook = {
  classObj: Class;
  marks: Marks[];
}