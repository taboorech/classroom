import { ConflictException, ForbiddenException, Injectable, NotFoundException, Request, UnauthorizedException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { UserCreateDto } from './dto/userCreate.dto';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt/dist';
import { JwtPayload } from './jwt-payload.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async signUp(userCreateDto: UserCreateDto): Promise<User> {
    const { email, login, surname, name, password } = userCreateDto;
    if(await this.userModel.findOne({ email })) {
      throw new ConflictException(`User with this email already registered`);
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({
      email,
      login,
      surname,
      name,
      password: hashPassword,
    });
    
    const refreshToken: string = await this.jwtService.sign(
      {
        _id: user._id,
        email: user.email,
      },
      {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES')
      }
    );
    const hashRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userModel.updateOne({ _id: user._id }, {
      refreshToken: hashRefreshToken
    })
    return user.save();
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string, refreshToken: string }> {
    const { email, password } = authCredentialsDto;
    const candidate = await this.userModel.findOne({ email });
    if(candidate && await bcrypt.compare(password, candidate.password)) {
      const payload: JwtPayload = { _id: candidate._id, email };
      const accessToken: string = await this.jwtService.sign(payload);
      const refreshToken: string = await this.jwtService.sign(
        {
          _id: candidate._id,
          email: candidate.email,
        },
        {
          secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
          expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES')
        }
      );
      const hashRefreshToken = await bcrypt.hash(refreshToken, 10);
      await this.userModel.updateOne({ _id: candidate._id }, {
        refreshToken: hashRefreshToken
      })
      return { accessToken, refreshToken };
    } else {
      throw new UnauthorizedException(`Wrong email or password`);
    }
  }

  async logout(user: User) {
    return this.userModel.updateOne({ _id: user._id }, { refreshToken: null });
  }

  async refreshTokens(user: User, oldRefreshToken: string): Promise<{ accessToken: string, refreshToken: string }> {
    const userObj = await this.userModel.findOne({ _id: user._id });

    if (!userObj || !userObj.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    const refreshTokenMatches = await bcrypt.compare(
      oldRefreshToken,
      userObj.refreshToken
    );
    const email = userObj.email;
    const payload: JwtPayload = { _id: userObj._id, email };
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const accessToken: string = await this.jwtService.sign(payload);
    const refreshToken: string = await this.jwtService.sign(
      {
        _id: user._id,
        email: user.email,
      },
      {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES')
      }
    );
    return { accessToken, refreshToken };
  }

}
