import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Class } from './class.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  _id: Types.ObjectId;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  login: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  refreshToken: string;

  @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Class'}]})
  classes: Class[];

  addClass: Function;

  removeClass: Function;

}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.addClass = async function (classId: Types.ObjectId): Promise<User> {
  const classes = [...this.classes];
  classes.push({_id: classId._id});
  this.classes = classes;
  return await this.save();
}

UserSchema.methods.removeClass = async function (classId: Types.ObjectId): Promise<User> {
  let classes = [...this.classes];
  classes = classes.filter(({_id}) => _id.toString() !== classId.toString());
  this.classes = classes;
  return await this.save();
}

// UserSchema.loadClass(User);