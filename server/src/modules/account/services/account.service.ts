import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { UserService } from 'src/modules/user/user.service'
import { UserRegisterDto } from 'src/modules/account/dtos/user-register.dto'
import { EmailVerificationDto } from 'src/modules/account/dtos/email-verification.dto'
import { PasswordService } from 'src/modules/commons/services/password.service'
import { IdGeneratorService } from 'src/modules/commons/services/id-generator.service'
import { ChangePasswordDto } from '../dtos/change-password.dto'


@Injectable()
export class AccountService {
	constructor(
		private readonly passwordService: PasswordService,
		private readonly userService: UserService,
		private readonly idGeneratorService: IdGeneratorService,
	) { }

	async changePassword(data: ChangePasswordDto) {
		const hashedPassword = await this.passwordService.hashPassword(data.password)
		const user = await this.userService.changePassword({email:data.email,password:hashedPassword})
		await this.userService.deleteVerificationCodes(data.email)
		return user
	}

	async createUser(data: UserRegisterDto) {
		const exists = await this.userExists({ email: data.email })
		if (exists) throw new BadRequestException('Email already exists')
		const hashedPassword = await this.passwordService.hashPassword(data.password)
		if (data.password !== data.confirmPassword) throw new BadRequestException('Passwords do not match')
		const user = await this.userService.create({
			id: this.idGeneratorService.randomStringId(10),
			password: hashedPassword,
			username: data.username,
			email: data.email,
		})
		await this.userService.deleteVerificationCodes(data.email)
		delete user.password
		return user
	}

	async userExists(data: EmailVerificationDto) {
		return await this.userService.findUnique({ email: data.email })
	}
}
