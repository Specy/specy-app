 
import { Module } from '@nestjs/common';
import { AccountController } from './controllers/account.controller';
import { EmailModule } from '../emailer/email.module';
import { UserModule } from '../user/user.module';
import { PasswordModule } from '../password/password.module';
import { RegisterService } from './services/register.service';
@Module({
  imports: [EmailModule,UserModule,PasswordModule],
  controllers:[AccountController],
  providers: [RegisterService],
})
export class AccountModule {}
