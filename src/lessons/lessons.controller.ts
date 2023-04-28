import { Body, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, Patch, Post, Put, Query, Req, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UpdateResult } from 'mongodb';
import { Attachments } from 'src/schemas/attachments.schema';
import { Lesson } from 'src/schemas/lesson.schema';
import { Marks } from 'src/schemas/marks.schema';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { MakeAssessmentDto } from './dto/make-assessment.dto';
import { TurnInDto, TurnInOperationDto } from './dto/turnIn.dto';
import { UpdateAssessmentDto } from './dto/update-assessment';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { GetWorks } from './lesson-get-works.type';
import { LessonGetRequest } from './lesson-getRequest.type';
import { LessonsService } from './lessons.service';
import { ReturnWorkDto } from './dto/return-word.dto';

@UseGuards(AuthGuard())
@Controller('classes')
@UseInterceptors(FilesInterceptor('files'))
export class LessonsController {
  constructor(
    private lessonsService: LessonsService
  ) { }

  @Get('/:id/:lessonId')
  getLesson(@Req() req, @Param('id') classId: string, @Param('lessonId') lessonId: string): Promise<LessonGetRequest> {
    return this.lessonsService.getLesson(req.user, classId, lessonId);
  }

  @Get('/:id/:lessonId/getLessonSettings')
  getLessonSetting(@Req() req, @Param('id') classId: string, @Param('lessonId') lessonId: string) {
    return this.lessonsService.getLessonSettings(req.user, classId, lessonId);
  }

  @Get('/:id/:lessonId/works')
  checkWorks(@Req() req, @Param('id') classId: string, @Param('lessonId') lessonId: string): Promise<GetWorks> {
    return this.lessonsService.checkWorks(req.user, classId, lessonId);
  }

  @Put('/:id/createLesson')
  createLesson(@Req() req, @Param('id') classId: string, @UploadedFiles() files: Array<Express.Multer.File>, @Body() createLessonDto: CreateLessonDto): Promise<Lesson> {
    return this.lessonsService.createLesson(req.user._id, classId, files, createLessonDto);
  }

  @Patch('/:id/:lessonId')
  updateLesson(@Req() req, @Param('id') classId: string, @Param('lessonId') lessonId: string, @UploadedFiles() files: Array<Express.Multer.File>,  @Body() updateLessonDto: UpdateLessonDto): Promise<UpdateResult> {
    return this.lessonsService.updateLesson(req.user._id, classId, lessonId, files, updateLessonDto);
  }

  @Delete('/:id/:lessonId')
  removeLesson(@Req() req, @Param('id') classId: string, @Param('lessonId') lessonId: string): Promise<string> {
    return this.lessonsService.removeLesson(req.user._id, classId, lessonId);
  }

  @Put('/:id/:lessonId/marks')
  addMark(@Req() req, @Param('id') classId: string, @Param('lessonId') lessonId: string, @Body() makeAssessmentDto: MakeAssessmentDto): Promise<Marks> {
    return this.lessonsService.addMark(req.user, classId, lessonId, makeAssessmentDto);
  }

  @Patch('/:id/:lessonId/marks')
  updateMark(@Req() req, @Param('id') classId: string, @Body() updateAssessmentDto: UpdateAssessmentDto): Promise<UpdateResult> {
    return this.lessonsService.updateMark(req.user, classId, updateAssessmentDto);
  }

  @Post('/:id/:lessonId/turnIn')
  turnIn(@Req() req, @Param('id') classId: string, @Param('lessonId') lessonId: string, @UploadedFiles() files: Array<Express.Multer.File>, @Query() turnInOperationDto: TurnInOperationDto, @Body() turnInDto: TurnInDto): Promise<Attachments> {
    return this.lessonsService.turnIn(req.user, classId, lessonId, files, turnInOperationDto, turnInDto);
  }

  @Patch('/:id/:lessonId/return')
  returnWork(@Req() req, @Param('id') classId: string, @Param('lessonId') lessonId: string, @Body() returnWorkDto: ReturnWorkDto) {
    return this.lessonsService.returnWork(req.user, classId, lessonId, returnWorkDto);
  }

}
