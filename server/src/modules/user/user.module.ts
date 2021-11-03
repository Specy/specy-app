
import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { CommonsModule } from '../commons/commons.module'
import { UserController } from './user.controller'
@Module({
	controllers: [UserController],
	imports: [CommonsModule],
	providers: [UserService],
	exports: [UserService],
})
export class UserModule { }