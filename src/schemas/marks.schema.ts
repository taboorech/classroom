import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Class } from './class.schema';
import { Lesson } from './lesson.schema';
import { User } from './user.schema';

export type MarksDocument = HydratedDocument<Marks>;

@Schema()
export class Marks {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' })
  lesson: Lesson;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Class' })
  class: Class;
  @Prop({required: true})
  mark: number;
}

export const MarksSchema = SchemaFactory.createForClass(Marks);