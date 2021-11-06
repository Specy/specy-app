import { User as UserEntity } from '.prisma/client'
import { Body, Controller, Get, Post, UseGuards , Logger} from '@nestjs/common'
import { SuccessfulResponse } from 'src/shared/Responses'
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
		let result = await this.authService.login(user)
		return result
	}

	@Get('status')
	@ApiOperation({
		summary: 'Validate authenticated user',
	})
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	status(@User() user: UserEntity) {
		return new SuccessfulResponse("User validated",{
			id: user.id,
			username: user.username
		})
	}

	@Post('refresh')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Create new tokens using refresh token',
	})
	async refresh(@User() user: UserEntity) {
		let result = await this.authService.login(user)
		return result
	}
}
