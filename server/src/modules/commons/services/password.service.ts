import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { checkStrenght, passwordStrength } from '../passwordStrength'

@Injectable()
export class PasswordService {

	async validatePassword(password: string, passwordHash: string) {
		return bcrypt.compare(password, passwordHash)
	}

	async hashPassword(password: string, saltOrRounds?: number | string) {
		return bcrypt.hash(password, saltOrRounds ?? 10)
	}
	
	getStrength(password: string): passwordStrength {
		return checkStrenght(password)
	}
}