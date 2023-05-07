import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
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
  surname: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  refreshToken: string;

  @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Class'}]})
  classes: Class[];

  @Prop(raw({student: [{
    _id: { type: Types.ObjectId },
    class: { type: mongoose.Schema.Types.ObjectId },
    message: { type: String }
  }], teacher: [{
    _id: { type: Types.ObjectId },
    class: { type: mongoose.Schema.Types.ObjectId },
    message: { type: String }
  }] }))
  notifications: Object;

  addClass: Function;

  removeClass: Function;

  addStudentNotification: Function;

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

UserSchema.methods.addStudentNotification = async function (classId: Types.ObjectId, notification: string): Promise<User> {
  const notifications = [...this.notifications.student];
  notifications.push({
    class: classId,
    message: notification
  })
  this.notifications = notifications;
  return await this.save();
}

// UserSchema.loadClass(User);