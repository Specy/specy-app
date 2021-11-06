import { User as UserEntity } from '.prisma/client'
import { Body, Controller, Get, Post, UseGuards , Logger, Res, Req} from '@nestjs/common'
import { SuccessfulResponse } from 'src/shared/Responses'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { User } from '../decorators/user.decorator'
import { UserLoginDto } from '../dtos/user-login.dto'
import { JwtAuthGuard } from '../guards/jwt.guard'
import { RefreshAuthGuard } from '../guards/refresh.guard'
import { LocalAuthGuard } from '../guards/local.guard'
import { AuthService } from '../services/auth.service'
import { Request, Response } from 'express'
import { UserService } from 'src/modules/user/user.service'
@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService,
		) { }

	@Post('login')
	@UseGuards(LocalAuthGuard)
	@ApiOperation({
		summary:
			'Authenticates using email and password. Tokens Usable within all apps',
	})
	async login(@Body() data: UserLoginDto, @User() user: UserEntity, @Res({passthrough:true}) res:Response) {
		let result = await this.authService.login(user)
		let newToken = {
			expiry: new Date().getTime() + 1000 * 60 * 60 * 24 * 30,
			userId: user.id,
			token: result.refreshToken
		}
		await this.userService.whitelistToken(newToken)
		await this.setToken(res,result.refreshToken)
		return result
	}

	@Get('status')
	@ApiOperation({
		summary: 'Validate authenticated user',
	})
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	status(@User() user: UserEntity) {
		return {
			id: user.id,
			username: user.username
		}
	}

	@Post('refresh')
	@UseGuards(RefreshAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Create new tokens using refresh token',
	})
	async refresh(@User() user: UserEntity, @Res({passthrough:true}) res:Response, @Req() req: Request) {
		let result = await this.authService.login(user)
		let oldToken = req.cookies[process.env.JWT_NAME]
		let newToken = {
			expiry: new Date().getTime() + 1000 * 60 * 60 * 24 * 30,
			userId: user.id,
			token: result.refreshToken
		}
		await this.userService.whitelistToken(newToken,oldToken)
		this.setToken(res,result.refreshToken)
		return result.accessToken
	}

	async setToken(res:Response, token:string){
		return res.cookie(process.env.JWT_NAME,token,{
			httpOnly: false,
			expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30)
		})
	}
}
