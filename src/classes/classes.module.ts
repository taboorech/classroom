import { Module } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { User, UserSchema } from '../schemas/user.schema';
import { Class, ClassSchema } from 'src/schemas/class.schema';
import { Lesson, LessonSchema } from 'src/schemas/lesson.schema';
import { Marks, MarksSchema } from 'src/schemas/marks.schema';

@Module({
  imports: [
    AuthModule, 
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }, 
      { name: Class.name, schema: ClassSchema }, 
      { name: Lesson.name, schema: LessonSchema },
      { name: Marks.name, schema: MarksSchema }
    ])
  ],
  providers: [ClassesService],
  controllers: [ClassesController]
})
export class ClassesModule {}
