import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/modules/user/user.service'
import { Request } from 'express';
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'refresh',
) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: (req: Request) => {
        const token = req.cookies[process.env.JWT_NAME];
        return token;
      },
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const id = payload.id;
    return this.userService.findUnique({ id });
  }
}