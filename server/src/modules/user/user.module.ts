import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserEmailerService } from './services/user-emailer.service';
@Module({
  providers: [UserService,UserEmailerService],
  exports: [UserService,UserEmailerService],
})
export class UserModule {}
