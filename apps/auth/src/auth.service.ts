import { Injectable } from '@nestjs/common';
import { UserDocument } from './users/models';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async login(user: UserDocument, res: Response) {
    const tokenPayload = {
      userId: user._id.toHexString(),
      email: user.email,
    };
    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
    );

    const token = this.jwtService.sign(tokenPayload);
    res.cookie('Authentication', token, { httpOnly: true, expires });
  }
}
