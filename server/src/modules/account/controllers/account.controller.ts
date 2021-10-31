import { Body, Controller, Get, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { UserRegisterDto } from 'src/modules/account/dtos/user-register.dto'
import { EmailVerificationDto } from 'src/modules/account/dtos/email-verification.dto'
import { RegisterService } from 'src/modules/account/services/register.service'

@Controller('account')
@ApiTags('Registration')
export class AccountController {
	constructor(private readonly registerService: RegisterService) { }

	@Post('verify')
	@ApiOperation({
		summary: 'Send verification code and save into db',
	})
	async verifyMail(@Body() data: EmailVerificationDto) {
		let result = await this.registerService.verifyEmail(data)
		return {
			message: 'Verification email sent',
			status: 'success'
		}
	}

	@Post('register')
	@ApiOperation({
		summary: 'Create a new account',
	})
	async register(@Body() data: UserRegisterDto) {
		return this.registerService.registerUser(data)
	}

}
