import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.request';
import { UsersService } from '../services/users.service';
import { User } from '../schemas/user.schema';
import { UserEventsProducer } from '../producer/user.producer';

@Controller('auth/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly userEventsProducer: UserEventsProducer,
  ) {}

  @Post()
  async createUser(@Body() request: CreateUserDto): Promise<User> {
    const user: User = await this.usersService.createUser(request);
    this.userEventsProducer.produceUserRegisteredEvent({
      _id: user._id.toString(),
    });
    return user;
  }
}
