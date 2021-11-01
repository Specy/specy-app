import { Body, Controller, Get, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { SuccessfulResponse } from "src/shared/Responses"
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
		await this.registerService.verifyEmail(data)
		return new SuccessfulResponse("Email successfully sent")
	}

	@Post('register')
	@ApiOperation({
		summary: 'Create a new account',
	})
	async register(@Body() data: UserRegisterDto) {
		let response = await this.registerService.registerUser(data)
		return  new SuccessfulResponse("User registered",response)
	}

}
