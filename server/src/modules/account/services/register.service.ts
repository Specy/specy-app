import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { UserService } from 'src/modules/user/user.service'
import { UserRegisterDto } from 'src/modules/account/dtos/user-register.dto'
import { EmailVerificationDto } from 'src/modules/account/dtos/email-verification.dto'
import { EmailService } from 'src/modules/email/email.service'
import { PasswordService } from 'src/modules/commons/services/password.service'
import { IdGeneratorService } from 'src/modules/commons/services/id-generator.service'


@Injectable()
export class RegisterService {
	constructor(
		private readonly passwordService: PasswordService,
		private readonly userService: UserService,
		private readonly emailService: EmailService,
		private readonly idGeneratorService: IdGeneratorService
	) { }

	async verifyEmail(data: EmailVerificationDto) {
		let exists = await this.userService.findUnique(data)
		
		if (exists) throw new BadRequestException('Email already exists')
		let token = await this.userService.storeVerificationCode(data.email)
		await this.emailService.sendEmailVerificationCode({ email: data.email, token: token })
		return true
	}

	async registerUser(data: UserRegisterDto) {
		let exists = await this.userService.findUnique({email:data.email})
		if(exists) throw new BadRequestException('Email already exists')
		const hashedPassword = await this.passwordService.hashPassword(
			data.password,
		)
		const verificationData = await this.userService.getVerificationData(data.email)
		if (verificationData?.token !== data.token) throw new BadRequestException('Invalid verification code')
		if (data.password !== data.confirmPassword) throw new BadRequestException('Passwords do not match')
		const user = await this.userService.create({
			id: this.idGeneratorService.randomStringId(12),
			password: hashedPassword,
			username: data.username,
			email: data.email,
		})
		delete user.password
		return user
	}
}
