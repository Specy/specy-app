import { IsEmail, IsString } from 'class-validator'
export class TokenVerificationDto {
   @IsEmail({}, {
      message: 'Invalid Email'
   })
   email: string
   @IsString({
       message: 'Invalid Token'
   })
    token: string
}