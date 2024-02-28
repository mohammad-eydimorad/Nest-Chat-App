import {
  DynamicModule,
  ForwardReference,
  INestApplication,
  Type,
  ValidationPipe,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
export class HttpProvider {
  static async createProvider(
    module:
      | Type<any>
      | DynamicModule
      | Promise<DynamicModule>
      | ForwardReference<any>,
    providers: any[] = [],
  ): Promise<INestApplication> {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [module],
      providers: providers,
    }).compile();

    const app: INestApplication = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    return app;
  }
}
