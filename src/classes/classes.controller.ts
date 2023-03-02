import { Body, Req, Controller, Post, Get, Delete, UseGuards } from '@nestjs/common';
import { Param, Patch, Put, Query } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { Class } from 'src/schemas/class.schema';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { ClassConnectDto } from './dto/class-connect.dto';
import { DeleteResult, UpdateResult } from 'mongodb';
import { GradeBook } from './classes-grade-book.type';
import { RemoveMemberDto } from './dto/remove-member.dto';
import { Marks } from 'src/schemas/marks.schema';

@Controller('classes')
@UseGuards(AuthGuard())
export class ClassesController {
  constructor(
    private classesService: ClassesService
  ) {}

  @Get('/')
  getClasses(@Req() req): Promise<Class[]> {
    return this.classesService.getClasses(req.user);
  }

  @Put('/create')
  createClass(@Req() req, @Body() createClassDto: CreateClassDto): Promise<Class> {
    return this.classesService.createClasses(req.user, createClassDto);
  }

  @Post('/connect')
  connectToClass(@Req() req, @Query() classConnectDto: ClassConnectDto): Promise<Class> {
    return this.classesService.connectToClass(req.user, classConnectDto);
  }

  @Patch('/:id/removeMember')
  removeMember(@Req() req, @Param('id') classId: string, @Body() removeMemberDto: RemoveMemberDto): Promise<Class> {
    return this.classesService.removeMember(req.user, classId, removeMemberDto);
  }

  @Get('/:id')
  classInfo(@Req() req, @Param('id') classId: string): Promise<{ classObj: Class, owner: boolean }> {
    return this.classesService.classInfo(req.user, classId);
  }

  @Get('/:id/gradeBook')
  getGradeBook(@Req() req, @Param('id') classId: string): Promise<Marks[]> {
    return this.classesService.getGradeBook(req.user, classId);
  }

  @Patch('/:id/info')
  updateClassInfo(@Req() req, @Param('id') classId: string, @Body() updateClassDto: UpdateClassDto): Promise<UpdateResult> {
    return this.classesService.updateClassInfo(classId, req.user, updateClassDto);
  }

  @Patch('/:id/addOwner')
  addOwner(@Req() req, @Param('id') classId: string, @Body() updateClassDto: UpdateClassDto): Promise<Class> {
    return this.classesService.addOwner(classId, req.user, updateClassDto);
  }

  @Patch('/:id/removeOwner')
  removeOwner(@Req() req, @Param('id') classId: string, @Body() updateClassDto: UpdateClassDto): Promise<Class> {
    return this.classesService.removeOwner(classId, req.user, updateClassDto);
  }

  @Delete('/:id')
  deleteClass(@Req() req, @Param('id') classId: string): Promise<DeleteResult> {
    return this.classesService.removeClasses(req.user, classId);
  }
}
