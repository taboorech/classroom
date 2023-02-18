import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Lesson } from './lesson.schema';
import { User } from './user.schema';

export type AttachmentsDocument = HydratedDocument<Attachments>;

@Schema()
export class Attachments {
  _id: mongoose.Types.ObjectId;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' })
  lesson: Lesson;
  @Prop({ required: true })
  turnIn: boolean;
  @Prop([{ originalname: { type: String }, type: {type: String}, path: { type: String } }])
  files: { originalname: string, type: string, path: string }[];
}

export const AttachmentsSchema = SchemaFactory.createForClass(Attachments);