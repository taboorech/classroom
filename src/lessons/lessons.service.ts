import { BadRequestException, Injectable, MethodNotAllowedException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types, UpdateQuery, UpdateWriteOpResult } from 'mongoose';
import { Class, ClassDocument } from 'src/schemas/class.schema';
import { Lesson, LessonDocument } from 'src/schemas/lesson.schema';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { DeleteResult, UpdateResult } from 'mongodb'
import { mkdir, Mode, unlink } from 'fs';
import { Marks, MarksDocument } from 'src/schemas/marks.schema';
import { User, UserDocument } from 'src/schemas/user.schema';
import { LessonGetRequest } from './lesson-getRequest.type';
import { MakeAssessmentDto } from './dto/make-assessment.dto';
import { checkOwner } from 'src/middleware/check-owner';
import { validLessonId } from 'src/middleware/valid-lessonId';
import { validClassId } from 'src/middleware/valid-classId';
import { elementEmptyValidatation } from 'src/middleware/element-empty';
import { checkMember } from 'src/middleware/check-member';
import { UpdateAssessmentDto } from './dto/update-assessment';
import { Attachments, AttachmentsDocument } from 'src/schemas/attachments.schema';
import { TurnInDto, TurnInOperationDto } from './dto/turnIn.dto';
import { GetWorks } from './lesson-get-works.type';

@Injectable()
export class LessonsService {
  constructor (
    @InjectModel(Class.name) private classModel: Model<ClassDocument>,
    @InjectModel(Lesson.name) private lessonModel: Model<LessonDocument>,
    @InjectModel(Marks.name) private marksModel: Model<MarksDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Attachments.name) private AttachmentsModel: Model<AttachmentsDocument>
  ) {}

  async getLesson(user: User, classId: string, lessonId: string): Promise<LessonGetRequest> {
    validLessonId(classId, lessonId, `Wrong path`);
    checkMember(classId, user, `You can not see the lesson`);
    const lesson = await this.lessonModel.findOne({ _id: lessonId });
    elementEmptyValidatation(lesson, `Lesson not found`);
    const userElements = await this.AttachmentsModel.findOne({ user, lesson });
    const marks = await this.marksModel.findOne({ user, lesson });
    return {
      lesson,
      userElements,
      marks
    };
  }

  async checkWorks(user: User, classId: string, lessonId: string): Promise<GetWorks> {
    validLessonId(classId, lessonId, `Wrong path`);
    checkMember(classId, user, `You can not check works`);
    const lesson = await this.lessonModel.findOne({ _id: lessonId });
    elementEmptyValidatation(lesson, `Lesson not found`);
    const marks = await this.marksModel.find({ lesson });
    const works = await this.AttachmentsModel.find({ lesson }).populate('user');

    return {
      lesson,
      marks,
      works
    };
  }

  async createLesson(userId: string, classId: string, files: Array<Express.Multer.File>, createLessonDto: CreateLessonDto): Promise<Lesson> {
    validClassId(classId, `Wrong path`);
    const classObj = await this.classModel.findOne({ _id: classId });
    elementEmptyValidatation(classObj, `Class not found`);
    checkOwner(classObj, userId, `You can not add a lesson`);
    let savedElements = [];
    files.map((file) => savedElements.push({
      originalname: file.originalname,
      type: 'file',
      path: file.path
    }));
    const { title, description, attachedElements, type, expires } = createLessonDto;
    attachedElements.map((attachedElement) => savedElements.push({
      originalname: null,
      type: 'path',
      path: attachedElement
    }));
    const lesson = new this.lessonModel({
      title,
      description,
      type,
      attachedElements: savedElements,
      expires
    })
    await classObj.addLessons(lesson);
    return await lesson.save();
  }

  async removeLesson(userId: string, classId: string, lessonId: string): Promise<string> {
    validLessonId(classId, lessonId, `Wrong path`);
    const classObj = await this.classModel.findOne({ _id: classId });
    elementEmptyValidatation(classObj, `Class not found`);

    checkOwner(classObj, userId, `You can not remove the lesson`);

    classObj.removeLessons(lessonId);

    const lesson = await this.lessonModel.findOneAndDelete({ _id: lessonId });
    elementEmptyValidatation(lesson, `Lesson not found`);
    lesson.attachedElements.map((attachedElement) => {
      if(attachedElement.type == 'file') {
        unlink(attachedElement.path, (err) => {
          console.log(err);
        });
      }
    })
    
    const userElements = await this.AttachmentsModel.find({ lesson });
    userElements.map((userElement) => {
      userElement.files.map((file) => {
        if(file.type == 'path') {
          unlink(file.path, (err) => {
            console.log(err);
          });
        }
      })
    });
    await this.AttachmentsModel.deleteMany({ lesson });
    return lesson.title;
  }

  async updateLesson(userId: string, classId: string, lessonId: string, files: Array<Express.Multer.File>, updateLessonDto: UpdateLessonDto): Promise<UpdateResult> {
    validLessonId(classId, lessonId, `Wrong path`);

    const classObj = await this.classModel.findOne({ _id: classId });
    elementEmptyValidatation(classObj, `Class not found`);

    checkOwner(classObj, userId, `You can not remove the lesson`);

    const savedElements = [];
    files.map((file) => savedElements.push({
      originalname: file.originalname,
      path: file.path
    }));
    const { title, description, type, attachedElements, expires } = updateLessonDto;    
    attachedElements.map((attachedElement) => savedElements.push({
      originalname: null,
      type: 'path',
      path: attachedElement
    }));

    const lesson = await this.lessonModel.updateOne({ _id: lessonId }, {
      title,
      description,
      type,
      attachedElements: savedElements,
      expires
    });

    elementEmptyValidatation(lesson, `Lesson not found`);

    return lesson;
  }

  async turnIn(user: User, classId: string, lessonId: string, files: Array<Express.Multer.File>, turnInOperationDto: TurnInOperationDto, turnInDto: TurnInDto): Promise<UpdateResult> {
    if(!mongoose.Types.ObjectId.isValid(lessonId)) {
      throw new BadRequestException(`Wrong path`);
    }
    checkMember(classId, user, `You can not turn in the exercise`);
    const { operation } = turnInOperationDto;
    const { attachedElements } = turnInDto;
    const lesson = await this.lessonModel.findOne({ _id: lessonId });
    if(lesson.type != 'EXERCISE') {
      return;
    }
    elementEmptyValidatation(lesson, `Lesson not found`);
    let savedElements = [];
    files.map((file) => savedElements.push({
      originalname: file.originalname,
      type: 'file',
      path: file.path
    }));
    
    attachedElements.map((attachedElement) => savedElements.push({
      originalname: null,
      type: 'path',
      path: attachedElement
    }));
    const turnInDocument = await this.AttachmentsModel.findOne({ user, lesson });
    switch(operation) {
      case 'UPLOAD':
        if(turnInDocument.turnIn) {
          throw new MethodNotAllowedException(`You can not add new elements`);
        }
        if(!turnInDocument) {
          await new this.AttachmentsModel({
            user,
            lesson,
            turnIn: false,
            files: savedElements
          }).save();
        } else {
          const files = turnInDocument.files;
          files.map((file) => savedElements.push(file));
          return await this.AttachmentsModel.updateOne({ user, lesson }, {
            files: savedElements
          })
        }
        break;
      case 'TURN_IN':
        return await this.AttachmentsModel.updateOne({ user, lesson }, {
          turnIn: true
        })
        break;
      case 'CANCEL':
        return await this.AttachmentsModel.updateOne({ user, lesson }, {
          turnIn: false
        })
        break;
      case 'DELETE_ELEMENTS':
        if(turnInDocument.turnIn) {
          throw new MethodNotAllowedException(`You can not add new elements`);
        }
        let files = turnInDocument.files;
        for(let i: number = 0; i < files.length; i++) {
          for(let j: number = 0; j < attachedElements.length; j++) {
            if(files[i].path == attachedElements[j]) {
              if(files[i].type == 'file') {
                unlink(files[i].path, (err) => {
                  console.log(err);
                });
              }
              files.splice(i, 1);
            }
          }
        }
        return await this.AttachmentsModel.updateOne({ user, lesson }, { files });
        break;
    }
  }

  async addMark(user: User, classId: string, lessonId: string, makeAssessmentDto: MakeAssessmentDto): Promise<void> {
    validLessonId(classId, lessonId, `Wrong path`);
    const { memberId, mark } = makeAssessmentDto;
    const classObj = await this.classModel.findOne({ _id: classId });
    elementEmptyValidatation(classObj, `Class not found`);
    checkOwner(classObj, user._id.toString(), `You can not make an assessment`);
    const lesson = await this.lessonModel.findOne({ _id: lessonId });
    elementEmptyValidatation(lesson, `Lesson not found`);
    const member = await this.userModel.findOne({ _id: memberId });
    elementEmptyValidatation(member, `User not found`);
    checkMember(classId, member, `User not found`);
    if(await this.marksModel.findOne({ user: member, lesson })) {
      throw new BadRequestException(`Evaluation is already`);
    }
    const saveMark = new this.marksModel({
      user: member,
      lesson,
      class: classObj,
      mark
    })
    await saveMark.save();
  }

  async updateMark(user: User, classId: string, updateAssessmentDto: UpdateAssessmentDto): Promise<UpdateResult> {
    validClassId(classId, `Wrong path`);
    const classObj = await this.classModel.findOne({ _id: classId });
    elementEmptyValidatation(classObj, `Class not found`);
    checkOwner(classObj, user._id.toString(), `You can not update an assessment`);
    const { markId, mark } = updateAssessmentDto;
    return await this.marksModel.updateOne({ _id: markId }, { mark });
  }
}
