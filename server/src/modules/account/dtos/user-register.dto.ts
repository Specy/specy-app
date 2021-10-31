import { IsEmail, MinLength, IsInt, Matches } from 'class-validator'
export class UserRegisterDto {
	@IsEmail({}, {
		message: "Invalid email"
	})
	email: string

	@MinLength(4, {
		message: "Username is too short, minimum 4 characters"
	})
	username: string

	@Matches(/(?=.*\d)(?=.*[A-Z])[a-zA-Z\d]{8,}/, {
		message: "Password is invalid"
	})
	password: string

	@Matches(/(?=.*\d)(?=.*[A-Z])[a-zA-Z\d]{8,}/, {
		message: "Confirm password is invalid"
	})
	confirmPassword: string

	@IsInt({
		message: "Invalid token"
	})
	token: number
}
