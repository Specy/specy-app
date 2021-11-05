import { Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { UserService } from 'src/modules/user/user.service'
import { UserLoginDto } from '../dtos/user-login.dto'
import { PasswordService } from 'src/modules/commons/services/password.service'

@Injectable()
export class AuthService {
	constructor(
		private readonly passwordService: PasswordService,
		private readonly userService: UserService,
	) { }

	async validateUser(data: UserLoginDto) {
		const user = await this.userService.findUnique({ email: data.email })
		if (!user) throw new UnauthorizedException('Invalid credentials')
		const isPasswordMatch = await this.passwordService.validatePassword(
			data.password,
			user.password,
		)
		if (isPasswordMatch) return user
		throw new UnauthorizedException('Invalid credentials')
	}

	async login(data: UserLoginDto) {
		let user = await this.validateUser(data)
		let session = await this.userService.createSession({email:data.email})
		delete user.password
		return {...user,session}
	}
}
