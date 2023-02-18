import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Class, ClassSchema } from 'src/schemas/class.schema';
import { Lesson, LessonSchema } from 'src/schemas/lesson.schema';
import { Marks, MarksSchema } from 'src/schemas/marks.schema';
import { MulterModule } from '@nestjs/platform-express/multer';
import { diskStorage } from 'multer';
import { Attachments, AttachmentsSchema } from 'src/schemas/attachments.schema';

@Module({
  imports: [
    AuthModule, 
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }, 
      { name: Class.name, schema: ClassSchema }, 
      { name: Lesson.name, schema: LessonSchema },
      { name: Marks.name, schema: MarksSchema },
      { name: Attachments.name, schema: AttachmentsSchema }
    ]),
    MulterModule.registerAsync({
      useFactory: async () => {
        return {
          storage: diskStorage({
            destination: async (req, file, cb) => {
              return cb(null, './upload');
            },
            filename: (req, file, cb) => {
              return cb(null, `${Date.now()}-${file.originalname}`);
            }
          })
        }
      },
    })
  ],
  providers: [LessonsService],
  controllers: [LessonsController]
})
export class LessonsModule {}
