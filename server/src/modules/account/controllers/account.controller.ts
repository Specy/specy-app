import { Body, Controller, Get, Post, BadRequestException, UnauthorizedException, Param } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { SuccessfulResponse } from "src/shared/Responses"
import { UserRegisterDto } from 'src/modules/account/dtos/user-register.dto'
import { EmailVerificationDto } from 'src/modules/account/dtos/email-verification.dto'
import { ChangePasswordDto } from 'src/modules/account/dtos/change-password.dto'
import { AccountService } from '../services/account.service'
import { TokenVerificationDto } from '../dtos/verify-code.dto'
import { TokenService } from '../services/token.service'


/*#TODO 
	- Delete token everytime its used (ex. changing password)
	- Add try catch to client
	- Make sure token is valid in auth
	- Consider using guard for routes that need a token
	- Consider changing alphabet of available letters for token (0,O,L,l,I)
	- Change disabled buttons to have the block icon and darker color, also no hover
	- There was something else but i forgot, maybe try to remember
	- See why css isnt shown in emails
*/
@Controller('account')
@ApiTags('Account')
export class AccountController {
	constructor(
		private readonly accountService: AccountService,
		private readonly tokenService: TokenService
	) { }

	@Post('activate/send')
	@ApiOperation({
		summary: 'Sends verification code for registering and save into db',
	})
	async sendRegistrationCode(@Body() data: EmailVerificationDto) {
		const exists = await this.accountService.userExists(data)
		if (exists) throw new BadRequestException("Email already exists")
		await this.tokenService.sendToken(data)
		return new SuccessfulResponse("Email successfully sent")
	}
	@Post('create/:token')
	@ApiOperation({
		summary: 'Create a new account',
	})
	async create(@Body() data: UserRegisterDto,@Param("token") token : string) {
		let response = await this.accountService.createUser({...data,token:token})
		return new SuccessfulResponse("User registered", response)
	}

	@Post('recover/:token')
	@ApiOperation({
		summary: 'Change password',
	})
	async recoverAccount(@Body() data: ChangePasswordDto,@Param("token") token : string) {
		let respone = await this.accountService.changePassword({...data,token:token})
		return new SuccessfulResponse("Password changed")
	}

	@Post('token/send')
	@ApiOperation({
		summary: 'Send verification code and saves into db',
	})
	async sendToken(@Body() data: EmailVerificationDto) {
		await this.tokenService.sendToken(data)
		return new SuccessfulResponse("Email successfully sent")
	}

	@Post('token/verify')
	@ApiOperation({
		summary: 'Verifies if token and email are correct',
	})
	async verifyToken(@Body() data: TokenVerificationDto) {
		let response = await this.tokenService.verifyToken(data)
		if(!response) return new UnauthorizedException("Token is wrong")
		return new SuccessfulResponse("Token verified")
	}
}
