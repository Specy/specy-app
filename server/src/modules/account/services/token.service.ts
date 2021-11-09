import { Injectable, Logger } from '@nestjs/common'
import { UserService } from 'src/modules/user/user.service'
import { EmailVerificationDto } from 'src/modules/account/dtos/email-verification.dto'
import { EmailService } from 'src/modules/email/email.service'
import { PasswordService } from 'src/modules/commons/services/password.service'
import { IdGeneratorService } from 'src/modules/commons/services/id-generator.service'
import { TokenVerificationDto } from '../dtos/verify-code.dto'


@Injectable()
export class TokenService {
	constructor(
		private readonly passwordService: PasswordService,
		private readonly userService: UserService,
		private readonly emailService: EmailService,
		private readonly idGeneratorService: IdGeneratorService
	) { }

	async sendToken(data: EmailVerificationDto) {
		const token = await this.userService.storeVerificationToken(data.email)
		await this.emailService.sendEmailVerificationCode({ email: data.email, token: token })
		return true
	}

	async verifyToken(data: TokenVerificationDto) {
		const verificationData = await this.userService.getVerificationToken(data.email)
		return verificationData?.token === data.token
	}

	async userExists(data: EmailVerificationDto) {
		return await this.userService.findUnique({ email: data.email })
	}
}