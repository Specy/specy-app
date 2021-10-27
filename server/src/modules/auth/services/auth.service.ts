import { User } from '.prisma/client';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/modules/user/services/user.service';
import { JwtPayloadDao } from '../dtos/jwt-payload.dao';
import { UserLoginDto } from '../dtos/user-login.dto';
import { UserRegisterDto } from '../dtos/user-register.dto';
import { PasswordService } from './password.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly passwordService: PasswordService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  async validateUser(data: UserLoginDto) {
    const user = await this.userService.findUnique({ email: data.email });
    if (!user) throw new BadRequestException('Invalid credentials');
    const isPasswordMatch = await this.passwordService.validatePassword(
      data.password,
      user.password,
    );
    if (isPasswordMatch) return user;
    return null;
  }
  async login(data: User) {
    return this.generateTokens(data);
  }
  async register(data: UserRegisterDto) {
    const hashedPassword = await this.passwordService.hashPassword(
      data.password,
    );
    const user = await this.userService.create({
      ...data,
      password: hashedPassword,
    });
    return this.generateTokens(user);
  }

  async generateTokens(data: JwtPayloadDao) {
    Logger.debug(this.configService.get('JWT_ACCESS_TOKEN_EXPIRES_IN'));
    Logger.debug(this.configService.get('JWT_REFRESH_TOKEN_EXPIRES_IN'));
    const accessToken = this.jwtService.sign(
      { id: data.id },
      {
        expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRES_IN'),
      },
    );
    const refreshToken = this.jwtService.sign(
      { id: data.id },
      {
        expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRES_IN'),
      },
    );
    return {
      accessToken,
      refreshToken,
    };
  }
}
