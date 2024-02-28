import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { User } from '../../users/schemas/user.schema';
import { CurrentUser } from '../current-user.decorator';
import JwtAuthGuard from '../guards/jwt-auth.guard';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthService } from '../services/auth.service';
import { AccessTokenResultModel } from '../interfaces/access-token.model';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AccessTokenResultModel> {
    return this.authService.login(user, response);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@CurrentUser() user: User): Promise<User> {
    return user;
  }
}
