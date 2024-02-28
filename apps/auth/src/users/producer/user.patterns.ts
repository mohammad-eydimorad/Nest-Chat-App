import { APPLICATION_NAME, APP_NAME } from './../../app-name';

export enum RmqMessagesEnum {
  UserRegistered = `${APPLICATION_NAME}.${APP_NAME}.user.registered`,
}
