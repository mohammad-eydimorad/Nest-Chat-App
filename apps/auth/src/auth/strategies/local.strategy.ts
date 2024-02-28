import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from '../../users/services/users.service';
import { User } from '../../users/schemas/user.schema';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<User> {
    try {
      return this.usersService.validateUser(email, password);
    } catch (err) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
  }
}
