import mongoose from 'mongoose';
import { HttpProvider } from '@app/common';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { INestApplication } from '@nestjs/common';
import { ChatModule } from '../../src/chat.module';
const feature = loadFeature('../chat-app.feature', {
  loadRelativePath: true,
  tagFilter: 'not @ignore',
});
defineFeature(feature, (test) => {
  let app: INestApplication;
  beforeEach(async () => {
    app = await HttpProvider.createProvider(ChatModule);
  });

  test('Test', ({ given }) => {
    given('Test', () => {
      return;
    });
  });

  afterAll(async () => {
    await app.close();
    await mongoose.disconnect();
  });
});
