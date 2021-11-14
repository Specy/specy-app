import { IsEmail, IsString } from "class-validator"
export class ChangePasswordDto {
    @IsEmail({},{
        message: 'Invalid email'
    })
    @IsString()
    email: string

    @IsString({
        message: 'Invalid password'
    })
	password: string
}