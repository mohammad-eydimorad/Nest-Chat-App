import * as request from 'supertest';
import { AuthModule } from '../../../src/auth.module';
import { UserRegistrationDto } from '../../../src/dto';
import expect from 'expect';
import { HttpProvider } from '../../lib';
import { defineFeature, loadFeature } from 'jest-cucumber';
const feature = loadFeature('../../user-registration.feature', {
  loadRelativePath: true,
  tagFilter: 'not @ignore',
});
defineFeature(feature, (test) => {
  let app: any;
  let user: UserRegistrationDto;
  let result: request.Response;
  beforeEach(async () => {
    app = await HttpProvider.createProvider(AuthModule);
  });
  afterAll(async () => {
    await app.close();
  });
  const givenTheUserIsOnRegistrationPage = (given) => {
    given('the user is on the registration page', async () => {
      user = new UserRegistrationDto();
    });
  };
  const whenSubmitsTheRegistrationForm = (when) => {
    when('submits the registration form', async () => {
      result = await request(app.getHttpServer()).post('/register').send(user);
    });
  };

  test('Successful user registration', ({ given, when, then }) => {
    givenTheUserIsOnRegistrationPage(given);

    when('the user provides valid registration details', () => {
      user.email = 'admin@gmail.com';
      user.password = '123456789';
    });

    whenSubmitsTheRegistrationForm(when);

    then('the user should be redirected to the login page', () => {
      expect(result.status).toEqual(201);
      expect(result.body).toEqual(
        expect.objectContaining({
          email: user.email,
        }),
      );
      expect(result.body._id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      );
    });
  });

  test('Failed user registration', ({ given, when, then }) => {
    givenTheUserIsOnRegistrationPage(given);

    when(
      /^the user provides registration details with (.*) and (.*)$/,
      (email: string, password: string) => {
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
      return;
    });
  }, 1000);
});
