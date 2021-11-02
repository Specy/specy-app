import { IsEmail, IsString, Matches } from 'class-validator'
export class ChangePasswordDto {
    @IsEmail({}, {
        message: 'Invalid Email'
    })
    email: string
    @IsString({
        message: 'Invalid Token'
    })
    token: string

    @Matches(/(?=.*\d)(?=.*[A-Z])[a-zA-Z\d]{8,}/, {
		message: "Password is invalid"
	})
	password: string
}