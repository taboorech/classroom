import { Body, Controller, Get, Post, Put, Req, UseGuards } from '@nestjs/common';
import { User } from 'src/schemas/user.schema';
import { AuthService } from './auth.service';
import { UserCreateDto } from './dto/userCreate.dto';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) {}

  @Put('/signUp')
  create(@Body() userCreateDto: UserCreateDto): Promise<User> {
    return this.authService.signUp(userCreateDto);
  }

  @Post('/signIn')
  singIn(@Body() authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string, refreshToken: string }> {
    return this.authService.signIn(authCredentialsDto);
  }

  @Get('/logout')
  @UseGuards(AuthGuard('jwt'))
  logout(@Req() req) {
    return this.authService.logout(req.user);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Get('/refresh')
  refreshTokens(@Req() req) {
   return this.authService.refreshTokens(req.user, req.user.refreshToken);
  }
}
