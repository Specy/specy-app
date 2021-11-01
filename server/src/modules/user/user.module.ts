
import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { CommonsModule } from '../commons/commons.module'
@Module({
	imports: [CommonsModule],
	providers: [UserService],
	exports: [UserService],
})
export class UserModule { }