import {
  DynamicModule,
  ForwardReference,
  Type,
  ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
export class HttpProvider {
  static async createProvider(
    module:
      | Type<any>
      | DynamicModule
      | Promise<DynamicModule>
      | ForwardReference<any>,
  ) {
    const moduleRef = await Test.createTestingModule({
      imports: [module],
    }).compile();

    const app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    return app;
  }
}
