import { User } from '.prisma/client'
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { UserService } from 'src/modules/user/user.service'
import { JwtPayloadDao } from '../dtos/jwt-payload.dao'
import { UserLoginDto } from '../dtos/user-login.dto'
import { PasswordService } from 'src/modules/commons/services/password.service'

@Injectable()
export class AuthService {
	constructor(
		private readonly passwordService: PasswordService,
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService,
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
		return null
	}

	async login(data: User) {
		return this.generateTokens(data)
	}
	async generateTokens(data: JwtPayloadDao) {
		const accessToken = this.jwtService.sign(
			{ id: data.id },
			{
				expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRES_IN'),
			},
		)
		const refreshToken = this.jwtService.sign(
			{ id: data.id },
			{
				expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRES_IN'),
			},
		)
		return {
			accessToken,
			refreshToken,
		}
	}
}
