
import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { CommonsModule } from '../commons/commons.module'
import { UserController } from './user.controller'
import { JwtModule } from '@nestjs/jwt'
@Module({
	controllers: [UserController],
	imports: [
		CommonsModule,
		JwtModule.register({ //#TODO check if this can be omitted
			secret: process.env.JWT_SECRET,
			signOptions: {
				expiresIn: '1h',
			},
		}),
	],
	providers: [UserService],
	exports: [UserService],
})
export class UserModule { }