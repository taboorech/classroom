import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from "passport-jwt";
import { User, UserDocument } from "../schemas/user.schema";
import { Request } from "express";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtSevice: JwtService
  ) {
    super({
      secretOrKey: process.env.REFRESH_TOKEN_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: any) {    
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
    return { ...payload, refreshToken };
  }
}