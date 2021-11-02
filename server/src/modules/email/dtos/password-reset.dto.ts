import { IsEmail, IsString } from 'class-validator'

export class PasswordResetDto{
    @IsEmail()
    email: string
    @IsString()
    token: string
}