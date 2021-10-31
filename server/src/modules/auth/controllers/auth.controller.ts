import { User as UserEntity } from '.prisma/client'
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { User } from '../decorators/user.decorator'
import { UserLoginDto } from '../dtos/user-login.dto'
import { JwtAuthGuard } from '../guards/jwt.guard'
import { LocalAuthGuard } from '../guards/local.guard'
import { AuthService } from '../services/auth.service'

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
	constructor(private readonly authService: AuthService) { }

	@Post('login')
	@UseGuards(LocalAuthGuard)
	@ApiOperation({
		summary:
			'Authenticates using email and password. Tokens Usable within all apps',
	})
	async login(@Body() data: UserLoginDto, @User() user: UserEntity) {
		return this.authService.login(user)
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
			username: user.username,
		}
	}

	@Post('refresh')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Create new tokens using refresh token',
	})
	refresh(@User() user: UserEntity) {
		return this.authService.login(user)
	}
}
