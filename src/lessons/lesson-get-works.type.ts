import { Attachments } from "src/schemas/attachments.schema";
import { Lesson } from "src/schemas/lesson.schema"
import { Marks } from "src/schemas/marks.schema";
import { User } from "src/schemas/user.schema";

export type GetWorks = {
  members: User[];
  lesson: Lesson;
  marks: Marks[];
  works: Attachments[];
}