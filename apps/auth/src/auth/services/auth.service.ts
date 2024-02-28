import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { AccessTokenResultModel } from '../interfaces/access-token.model';
import { User } from '../../users/schemas/user.schema';

export interface TokenPayload {
  userId: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: User, response: Response): Promise<AccessTokenResultModel> {
    const tokenPayload: TokenPayload = {
      userId: user._id.toHexString(),
    };

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
    );

    const token = this.jwtService.sign(tokenPayload);

    response.cookie('Authorization', token, {
      httpOnly: true,
      expires,
    });
    return {
      accessToken: token,
    };
  }

  logout(response: Response): void {
    response.cookie('Authorization', '', {
      httpOnly: true,
      expires: new Date(),
    });
  }
}
