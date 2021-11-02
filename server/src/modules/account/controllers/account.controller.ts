import { Body, Controller, Get, Post, BadRequestException, UnauthorizedException } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { SuccessfulResponse } from "src/shared/Responses"
import { UserRegisterDto } from 'src/modules/account/dtos/user-register.dto'
import { EmailVerificationDto } from 'src/modules/account/dtos/email-verification.dto'
import { ChangePasswordDto } from 'src/modules/account/dtos/change-password.dto'
import { AccountService } from '../services/account.service'
import { TokenVerificationDto } from '../dtos/verify-code.dto'
import { TokenService } from '../services/token.service'

@Controller('account')
@ApiTags('Account')
export class AccountController {
	constructor(
		private readonly accountService: AccountService,
		private readonly tokenService: TokenService
	) { }

	@Post('sendCode')
	@ApiOperation({
		summary: 'Send verification code and save into db',
	})
	async sendVerification(@Body() data: EmailVerificationDto) {
		await this.tokenService.sendToken(data)
		return new SuccessfulResponse("Email successfully sent")
	}

	@Post('sendRegistrationCode')
	@ApiOperation({
		summary: 'Sends verification code for registering and save into db',
	})
	async sendRegistrationCode(@Body() data: EmailVerificationDto) {
		const exists = this.accountService.userExists(data)
		if (exists) throw new BadRequestException("User already exists")
		await this.tokenService.sendToken(data)
		return new SuccessfulResponse("Email successfully sent")
	}

	@Post('verifyCode')
	@ApiOperation({
		summary: 'Sends verification code to email and save into db',
	})
	async verifyToken(@Body() data: TokenVerificationDto) {
		let response = await this.tokenService.verifyToken(data)
		if(!response) return new UnauthorizedException("Token is wrong")
		return new SuccessfulResponse("Token verified")
	}

	@Post('register')
	@ApiOperation({
		summary: 'Create a new account',
	})
	async register(@Body() data: UserRegisterDto) {
		console.log(data)
		let response = await this.accountService.registerUser(data)
		return new SuccessfulResponse("User registered", response)
	}

	@Post('changePassword')
	@ApiOperation({
		summary: 'Change password',
	})
	async changePassword(@Body() data: ChangePasswordDto) {
		let respone = await this.accountService.changePassword(data)
		return new SuccessfulResponse("Password changed")
	}
}
