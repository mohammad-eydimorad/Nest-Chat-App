import * as request from 'supertest';
import { AuthModule } from '../../src/auth.module';
import { CreateUserDto } from '../../src/users/dto/create-user.request';
import mongoose from 'mongoose';
import { HttpProvider } from '@app/common';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { INestApplication } from '@nestjs/common';
const feature = loadFeature('../user-registration.feature', {
  loadRelativePath: true,
  tagFilter: 'not @ignore',
});
defineFeature(feature, (test) => {
  let app: INestApplication;
  let user: CreateUserDto;
  let result: request.Response;
  beforeEach(async () => {
    app = await HttpProvider.createProvider(AuthModule);
  });
  const givenTheUserIsOnRegistrationPage = (given: any): void => {
    given('the user is on the registration page', async () => {
      user = new CreateUserDto();
    });
  };
  const whenSubmitsTheRegistrationForm = (when: any): void => {
    when('submits the registration form', async () => {
      result = await request(app.getHttpServer())
        .post('/auth/users')
        .send(user);
    });
  };

  test('Successful user registration', ({ given, when, then }) => {
    givenTheUserIsOnRegistrationPage(given);

    when('the user provides valid registration details', () => {
      user.name = 'valid_name';
      user.email = 'admin@gmail.com';
      user.password = '123456789';
    });

    whenSubmitsTheRegistrationForm(when);

    then('the user should be redirected to the login page', () => {
      expect(result.status).toEqual(201);
      expect(result.body.name).toEqual(user.name);
      expect(result.body.email).toEqual(user.email);
      expect(result.body).not.toHaveProperty('password');
      expect(result.body._id).toMatch(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i);
    });
  });

  test('Email Already Registered', ({ given, when, then }) => {
    givenTheUserIsOnRegistrationPage(given);

    given(
      'there is an existing user with the same email address in the system',
      async () => {
        user.name = 'valid_name_2';
        user.email = 'admin2@gmail.com';
        user.password = '123456789';
        await request(app.getHttpServer()).post('/auth/users').send(user);
      },
    );

    when('the user enters a valid email and password', () => {
      user.name = 'valid_name_2';
      user.email = 'admin2@gmail.com';
      user.password = '123456789';
    });

    whenSubmitsTheRegistrationForm(when);

    then(
      'an error message should be displayed indicating that the email is already registered',
      () => {
        expect(result.status).toEqual(422);
        expect(result.body.message).toContain('Email already exists.');
        expect(result.body._id).toBeFalsy();
        expect(result.body.name).toBeFalsy();
        expect(result.body.email).toBeFalsy();
      },
    );
  });

  test('Failed user registration', ({ given, when, then }) => {
    givenTheUserIsOnRegistrationPage(given);

    when(
      /^the user provides registration details with (.*), (.*) and (.*)$/,
      (name: string, email: string, password: string) => {
        user.name = name;
        user.email = email;
        user.password = password;
      },
    );

    whenSubmitsTheRegistrationForm(when);

    then(/^(.*) message should be displayed$/, (error: string) => {
      expect(result.status).toEqual(400);
      expect(result.body.message).toContain(error);
    });

    then('the user should stay on the registration page', () => {
      expect(result.body._id).toBeFalsy();
      expect(result.body.name).toBeFalsy();
      expect(result.body.email).toBeFalsy();
    });
  });

  afterAll(async () => {
    await app.close();
    await mongoose.disconnect();
  });
});
