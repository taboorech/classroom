import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Marks } from './marks.schema';

export type LessonDocument = HydratedDocument<Lesson>;

@Schema()
export class Lesson {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  type: string;

  @Prop({ default: 12 })
  maxMark: number;

  @Prop([{ originalname: { type: String }, type: { type: String }, path: { type: String } }])
  attachedElements: { originalname: string, type: string, path: string }[];

  @Prop({ default: null })
  expires: string;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);