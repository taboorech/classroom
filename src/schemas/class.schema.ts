import { MethodNotAllowedException, ConflictException, NotFoundException } from '@nestjs/common/exceptions';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { async } from 'rxjs';
import { Lesson } from './lesson.schema';
import { User } from './user.schema';

export type ClassDocument = HydratedDocument<Class>;

@Schema()
export class Class {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }] })
  lessons: Lesson[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], required: true })
  owners: User[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], required: true })
  members: User[];

  @Prop({ default: Date.now().toString(), required: true })
  accessToken: string;

  addOwner: Function;

  removeOwner: Function;

  addMembers: Function;

  removeMembers: Function;

  addLessons: Function;

  removeLessons: Function;
}

export const ClassSchema = SchemaFactory.createForClass(Class);

ClassSchema.methods.addMembers = async function (member: User) {
  if(this.members.find((member: User) => member.toString() == member._id.toString())) {
    throw new ConflictException(`You already connect to the classroom`);
  }
  const members = [...this.members];
  members.push(member);
  this.members = members;
  return await this.save();
}

ClassSchema.methods.removeMembers = async function (user: User, memberId: string) {
  if(!this.owners.find((owner: User) => owner._id.toString() == user._id.toString()) && !(user._id.toString() == memberId)) {
    throw new MethodNotAllowedException(`You can not remove the member`);
  }
  if(!this.members.find((member: User) => member.toString() == memberId.toString())) {
    throw new NotFoundException(`User hasn't been found`);
  }
  let members = [...this.members];
  members = members.filter(({_id}) => _id.toString() != memberId.toString());
  this.members = members;
  return await this.save();
}

ClassSchema.methods.addOwner = async function (user: User, owner: User) {
  if (this.owners.find((owner: Types.ObjectId) => owner.toString() == user._id.toString())) {
    let members = [...this.members];
    const owners = [...this.owners];
    members = members.filter(({_id}) => _id.toString() != owner.toString());
    owners.push(owner);
    this.owners = owners;
    this.members = members;
    return await this.save();
  } else {
    throw new MethodNotAllowedException(`You can not add owner`);
  }
}

ClassSchema.methods.removeOwner = async function (user: User, owner: User) {
  if (this.owners.find((owner: Types.ObjectId) => owner.toString() == user._id.toString()) && this.owners.indexOf(owner) != 0) {
    let owners = [...this.owners];
    const members = [...this.members];
    owners = owners.filter(({_id}) => _id.toString() !== owner.toString());
    members.push(owner);
    this.members = members;
    this.owners = owners;
    return await this.save();
  } else {
    throw new MethodNotAllowedException(`You can not remove the owner`);
  }
}

ClassSchema.methods.addLessons = async function (lesson: Lesson) {
  const lessons = [...this.lessons];
  lessons.push(lesson);
  this.lessons = lessons;
  return this.save();
}

ClassSchema.methods.removeLessons = async function (lessonId: string) {
  let lessons = [...this.lessons];
  lessons = lessons.filter(({_id}) => _id.toString() != lessonId.toString());
  this.lessons = lessons;
  return this.save();
}