import { Module } from '@nestjs/common'
import { AuthService } from './services/auth.service'
import { AuthController } from './controllers/auth.controller'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { CommonsModule } from '../commons/commons.module'
import { JwtStrategy } from './strategies/jwt.strategy'
import { LocalStrategy } from './strategies/local.strategy'
import { AccountModule } from '../account/account.module'
import { JwtRefreshStrategy  } from './strategies/refresh.strategy'
import { UserModule } from '../user/user.module'
@Module({
	imports: [
		AccountModule,
		CommonsModule,
		PassportModule,
		UserModule,
		JwtModule.register({
			secret: process.env.JWT_SECRET,
			signOptions: {
				expiresIn: '1h',
			},
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy, LocalStrategy,JwtRefreshStrategy],
	exports: [AuthService],
})
export class AuthModule { }
