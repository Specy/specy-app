
import { Module } from '@nestjs/common'
import { AccountController } from './controllers/account.controller'
import { EmailModule } from '../email/email.module'
import { UserModule } from '../user/user.module'
import { CommonsModule } from '../commons/commons.module'
import { AccountService } from './services/account.service'
import { TokenService } from './services/token.service'
@Module({
	imports: [EmailModule, UserModule, CommonsModule],
	controllers: [AccountController],
	providers: [AccountService,TokenService],
})
export class AccountModule { }
