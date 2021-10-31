import { IsEmail } from 'class-validator'
export class EmailVerificationDto {
   @IsEmail({}, {
      message: 'Invalid Email'
   })
   email: string
}