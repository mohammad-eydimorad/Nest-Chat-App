import {
  DynamicModule,
  ForwardReference,
  Type,
  ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthController } from '../../src/controllers';
import { AuthService } from '../../src/auth.service';

export class HttpProvider {
  static async createProvider(
    module:
      | Type<any>
      | DynamicModule
      | Promise<DynamicModule>
      | ForwardReference<any>,
  ) {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
      imports: [module],
    }).compile();

    const app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    return app.getHttpServer();
  }
}
