import { User as UserEntity } from '.prisma/client'
import { Body, Controller, Get, Post, UseGuards , Res } from '@nestjs/common'
import { Response } from 'express'
import { SuccessfulResponse } from 'src/shared/Responses'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { User } from '../decorators/user.decorator'
import { UserLoginDto } from '../dtos/user-login.dto'
import { AuthService } from '../services/auth.service'
import { CookieGuard } from '../guards/cookie.guard'

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
	constructor(private readonly authService: AuthService) { }

	@Post('login')
	@ApiOperation({
		summary:'Authenticates using email and password. Tokens Usable within all apps',
	})
	async login(@Body() data: UserLoginDto, @Res({passthrough:true}) res: Response) {
		let result = await this.authService.login(data)
		res.cookie("session_id",result.session,{
			expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30)
		})
		return result
	}

	@Get('status')
	@ApiOperation({
		summary: 'Validate authenticated user',
	})
	@ApiBearerAuth()
	@UseGuards(CookieGuard)
	status() {
		return new SuccessfulResponse("User validated")
	}

	@Post('refresh')
	@UseGuards(CookieGuard)
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Create new tokens using refresh token',
	})
	async refresh() {
		return "test"
	}
}
