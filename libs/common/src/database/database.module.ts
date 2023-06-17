import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        if (configService.get<string>('NODE_ENV') === 'test') {
          return {
            uri: global.__MONGO_URI__,
          };
        } else {
          return {
            connectionName: (new Date().getTime() * Math.random()).toString(16),
            uri: configService.get<string>('MONGODB_URI'),
          };
        }
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
