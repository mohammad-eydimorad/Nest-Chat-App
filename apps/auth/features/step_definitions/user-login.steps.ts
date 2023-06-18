import * as request from 'supertest';
import { AuthModule } from '../../src/auth.module';
import mongoose from 'mongoose';
import { HttpProvider } from '@app/common';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { INestApplication } from '@nestjs/common';
import { UsersFixture } from '../fixtures/users.fixture';
import { getConnectionToken } from '@nestjs/mongoose';
const feature = loadFeature('../user-login.feature', {
  loadRelativePath: true,
  tagFilter: 'not @ignore',
});
defineFeature(feature, (test) => {
  let app: INestApplication;
  let user: any;
  let result: request.Response;
  beforeEach(async () => {
    app = await HttpProvider.createProvider(AuthModule);
  });

  test('Successful Login', ({ given, when, then }) => {
    given('I use DB fixture "users"', async () => {
      const fixture = new UsersFixture(app.get(getConnectionToken()), app);
      await fixture.apply();
    });
    given('the user is on the login page', () => {
      user = {};
    });
    when('the user enters a valid email and password', () => {
      user.email = UsersFixture.user_1.email;
      user.password = UsersFixture.user_1.password;
    });
    when('clicks on the login button', async () => {
      result = await request(app.getHttpServer())
        .post('/auth/login')
        .send(user);
    });
    then('the user should be redirected to the home page', async () => {
      expect(result.status).toBe(201);
      expect(result.body.accessToken).toBeTruthy();
      const me = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `bearer ${result.body.accessToken}`)
        .send();
      expect(me.status).toBe(200);
      expect(me.body).not.toBeNull();
      expect(me.body._id).toEqual(UsersFixture.user_1._id);
      expect(me.body.name).toEqual(UsersFixture.user_1.name);
      expect(me.body.email).toEqual(UsersFixture.user_1.email);
      expect(me.body).not.toHaveProperty('password');
    });
  });

  test('Failed login', ({ given, when, then }) => {
    given('the user is on the login page', () => {
      user = {};
    });
    when(
      /^the user enter invalid (.*) and (.*)$/,
      (email: string, password: string) => {
        user.email = email;
        user.password = password;
      },
    );
    when('clicks on the login button', async () => {
      result = await request(app.getHttpServer())
        .post('/auth/login')
        .send(user);
    });
    then(/^(.*) message should be displayed$/, (error: string) => {
      expect(result.status).toEqual(401);
      expect(result.body.message).toContain(error);
    });
    then('the user should stay on the login page', () => {
      return;
    });
  });

  afterAll(async () => {
    await app.close();
    await mongoose.disconnect();
  });
});
