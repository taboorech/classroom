import { Attachments } from "src/schemas/attachments.schema";
import { Lesson } from "src/schemas/lesson.schema"
import { Marks } from "src/schemas/marks.schema";

export type GetWorks = {
  lesson: Lesson;
  marks: Marks[];
  works: Attachments[];
}