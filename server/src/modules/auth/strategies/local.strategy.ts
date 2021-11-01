import { Injectable, UnauthorizedException , Logger} from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { AuthService } from '../services/auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly authService: AuthService) {
		super({
			usernameField: 'email',
			passwordField: 'password',
		})
	}

	async validate(email: string, password: string): Promise<any> {
		let start = new Date().getTime()
		const user = await this.authService.validateUser({ email, password })
		if (!user) {
			throw new UnauthorizedException()
		}
		return user
	}
}
