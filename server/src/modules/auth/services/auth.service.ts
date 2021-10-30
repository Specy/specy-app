import { User } from '.prisma/client';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/modules/user/services/user.service';
import { UserEmailerService } from 'src/modules/user/services/user-emailer.service'
import { JwtPayloadDao } from '../dtos/jwt-payload.dao';
import { UserLoginDto } from '../dtos/user-login.dto';
import { UserRegisterDto } from '../dtos/user-register.dto';
import { EmailVerificationDto } from '../dtos/email-verification.dto';
import { PasswordService } from './password.service';
import { customAlphabet } from 'nanoid';
import * as EmailValidator from 'email-validator';
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function randomId(length: number = 12): string {
    const nanoid = customAlphabet(alphabet, length);
    return nanoid()
}

@Injectable()
export class AuthService {
  constructor(
    private readonly passwordService: PasswordService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly userEmailerService: UserEmailerService,
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
  async verifyEmail(data: EmailVerificationDto) {
    let verificationData = {
      email: data.email,
      token: Math.floor(Math.random() * 100000)
    } 
    if(await this.userService.existsMail(data.email)) throw new BadRequestException('Email already exists')
    if(!EmailValidator.validate(data.email)) throw new BadRequestException('Invalid email')
    await this.userService.verifyEmail(verificationData)
    await this.userEmailerService.sendVerificationCode(verificationData)
    
  }
  async register(data: UserRegisterDto) {
    const hashedPassword = await this.passwordService.hashPassword(
      data.password,
    );
    const verificationData = await this.userService.getVerificationData(data.email)
    if(await this.userService.existsMail(data.email)) throw new BadRequestException('Email already exists')
    if(!EmailValidator.validate(data.email)) throw new BadRequestException('Invalid email')
    if(verificationData?.token !== data.token) throw new BadRequestException('Invalid verification code')
    if(data.username.length < 4) throw new BadRequestException('Username must be at least 4 characters long')
    if(this.passwordService.getStrength(data.password).id < 1) throw new BadRequestException('Password is too weak')
    if(data.password !== data.confirmPassword) throw new BadRequestException('Passwords do not match')
    const user = await this.userService.create({
      id: randomId(12),
      password: hashedPassword,
      username: data.username,
      email: data.email,
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
