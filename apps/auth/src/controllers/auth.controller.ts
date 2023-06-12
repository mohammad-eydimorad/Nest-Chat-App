import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserRegistrationDto } from '../dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(
    @Body() userRegistrationDto: UserRegistrationDto,
  ): UserRegistrationDto {
    return {
      ...userRegistrationDto,
      _id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    };
  }
}
