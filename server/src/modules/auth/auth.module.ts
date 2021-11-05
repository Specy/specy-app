import { Module } from '@nestjs/common'
import { AuthService } from './services/auth.service'
import { AuthController } from './controllers/auth.controller'
import { CommonsModule } from '../commons/commons.module'
import { AccountModule } from '../account/account.module'
import { UserModule } from '../user/user.module'
@Module({
	imports: [
		AccountModule,
		CommonsModule,
		UserModule
	],
	controllers: [AuthController],
	providers: [AuthService],
	exports: [AuthService],
})
export class AuthModule { }
