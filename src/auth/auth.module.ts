import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from '../schemas/user.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { Class, ClassSchema } from 'src/schemas/class.schema';
import { Lesson, LessonSchema } from 'src/schemas/lesson.schema';
import { JwtRefreshStrategy } from './jwt-refresh.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>("ACCESS_TOKEN_SECRET"),
          signOptions: {
            expiresIn: '1h'
          }
        }
      },
      imports: [ConfigModule],
      inject: [ConfigService]
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Class.name, schema: ClassSchema },
      { name: Lesson.name, schema: LessonSchema }
    ]),
    ConfigModule
  ],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule]
})
export class AuthModule { }
