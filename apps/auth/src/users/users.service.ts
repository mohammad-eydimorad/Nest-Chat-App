import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { UsersRepository } from './users.repository';
import { CreateUserRequest } from './dto/create-user.request';
import { User } from './schemas/user.schema';
import { PasswordEncoder } from './tools/password-encoder';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async createUser(request: CreateUserRequest): Promise<User> {
    await this.validateCreateUserRequest(request);
    const user = await this.usersRepository.create({
      ...request,
      password: await PasswordEncoder.encodePassword(request.password),
    });
    return user;
  }

  private async validateCreateUserRequest(
    request: CreateUserRequest,
  ): Promise<void> {
    let user: User;
    try {
      user = await this.usersRepository.findOne({
        email: request.email,
      });
    } catch (err) {}

    if (user) {
      throw new UnprocessableEntityException('Email already exists.');
    }
  }

  async validateUser(email: string, password: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({ email });
      const passwordIsValid = await PasswordEncoder.comparePasswords(
        password,
        user.password,
      );
      if (!passwordIsValid) {
        throw new UnauthorizedException('Credentials are not valid.');
      }
      return user;
    } catch (err) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
  }

  async getUser(getUserArgs: Partial<User>): Promise<User> {
    return this.usersRepository.findOne(getUserArgs, '-password');
  }
}
