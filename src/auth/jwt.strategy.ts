import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from "passport-jwt";
import { User, UserDocument } from "../schemas/user.schema";
import { JwtPayload } from "./jwt-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {
    super({
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { _id, email } = payload;
    const candidate: User = await this.userModel.findOne({ _id, email });
    if(!candidate) {
      throw new UnauthorizedException();
    }

    return candidate;
  }
}