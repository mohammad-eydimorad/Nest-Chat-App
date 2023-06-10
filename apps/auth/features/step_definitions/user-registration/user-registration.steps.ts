import * as request from 'supertest';
import { Given, When, Then, Before } from '@cucumber/cucumber';
import { AuthModule } from '../../../src/auth.module';
import { UserRegistrationDto } from '../../../src/dtos';
import expect from 'expect';
import { HttpProvider, HttpWorld } from '../../lib';

Before<URW>('', async function () {
  this.httpServer = await HttpProvider.createProvider(AuthModule);
});

Given<URW>('the user is on the registration page', async function () {
  return;
});

When<URW>('submits the registration form', async function () {
  this.result = await request(this.httpServer)
    .post('/register')
    .send(this.user);
});

When<URW>(
  'the user provides registration details with {string} and {string}',
  function (email: string, password: string) {
    this.user = new UserRegistrationDto();
    this.user.email = email;
    this.user.password = password;
  },
);

Then<URW>('an {string} message should be displayed', function (error: string) {
  expect(this.result.status).toEqual(400);
  expect(this.result.body.message).toContain(error);
});

Then('the user should stay on the registration page', function () {
  return;
});

When<URW>('the user provides valid registration details', function () {
  this.user = new UserRegistrationDto();
  this.user.email = 'valid@email.com';
  this.user.password = 'valid_password';
});

Then<URW>('the user should be redirected to the login page', async function () {
  expect(this.result.status).toEqual(201);
  expect(this.result.body).toEqual(
    expect.objectContaining({
      email: this.user.email,
    }),
  );
  expect(this.result.body._id).toMatch(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  );
});

class URW extends HttpWorld {
  user: UserRegistrationDto;
  result: request.Response;
}
