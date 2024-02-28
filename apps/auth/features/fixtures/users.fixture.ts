import { INestApplication } from '@nestjs/common';
import { PasswordEncoder } from '../../src/users/tools/password-encoder';
import { Connection, Model } from 'mongoose';
import { User } from '../../src/users/schemas/user.schema';

export class UsersFixture {
  public static user_1 = {
    _id: '648d846f80479449680ab5d0',
    name: 'test-user-1',
    password: '12345678',
    email: 'user-1@example.com',
  };
  protected readonly connection: Connection;
  protected readonly application: INestApplication;
  private readonly userModel: Model<User>;
  constructor(connection: Connection, application: INestApplication) {
    this.connection = connection;
    this.application = application;
    this.userModel = this.application.get('UserModel');
  }

  async apply(): Promise<void> {
    await this.userModel.create({
      ...UsersFixture.user_1,
      password: await PasswordEncoder.encodePassword(
        UsersFixture.user_1.password,
      ),
    });
  }
}
