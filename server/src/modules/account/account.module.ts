 
import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { AccountController } from './controllers/account.controller';
import { UserEmailerService } from './services/user-emailer.service';
import { PasswordService } from 'src/injectables/password.service';
import { RegisterService } from './services/register.service';
@Module({
  controllers:[AccountController],
  providers: [UserService,UserEmailerService,PasswordService,RegisterService],
  exports: [UserService,UserEmailerService],
})
export class AccountModule {}
