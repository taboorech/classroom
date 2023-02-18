import { Attachments } from "src/schemas/attachments.schema"
import { Lesson } from "src/schemas/lesson.schema"
import { Marks } from "src/schemas/marks.schema"

export type LessonGetRequest = {
  lesson: Lesson,
  userElements: Attachments,
  marks: Marks
}