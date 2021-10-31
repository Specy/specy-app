import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { UserRegisterDto } from 'src/modules/account/dtos/user-register.dto';
import { EmailVerificationDto } from 'src/modules/account/dtos/email-verification.dto';
import { EmailService } from 'src/modules/emailer/email.service';
import { PasswordService } from 'src/modules/password/services/password.service';
import { customAlphabet } from 'nanoid';
import * as EmailValidator from 'email-validator';
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function randomId(length: number = 12): string {
    const nanoid = customAlphabet(alphabet, length);
    return nanoid()
}

@Injectable()
export class RegisterService {
  constructor(
    private readonly passwordService: PasswordService,
    private readonly userService: UserService,
    private readonly EmailService: EmailService,
  ) {}

  async verifyEmail(data: EmailVerificationDto) {
    let verificationData = {
      email: data.email,
      token: Math.floor(Math.random() * 900000 + 100000)
    } 
    if(await this.userService.existsMail(data.email)) throw new BadRequestException('Email already exists')
    if(!EmailValidator.validate(data.email)) throw new BadRequestException('Invalid email')
    await this.userService.verifyEmail(verificationData)
    await this.EmailService.sendEmailVerificationCode(verificationData)
    
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
    // generate tokens here
    return {
      data: "done"
    }
  }
}
