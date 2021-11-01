
import { Module } from '@nestjs/common'
import { AccountController } from './controllers/account.controller'
import { EmailModule } from '../email/email.module'
import { UserModule } from '../user/user.module'
import { CommonsModule } from '../commons/commons.module'
import { RegisterService } from './services/register.service'
@Module({
	imports: [EmailModule, UserModule, CommonsModule],
	controllers: [AccountController],
	providers: [RegisterService],
})
export class AccountModule { }
