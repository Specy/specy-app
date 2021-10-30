const nodemailer = require("nodemailer");
import { Injectable } from '@nestjs/common';
import {EmailVerificationData,PasswordResetData} from '../../../types/user.types'
const { env } = process
@Injectable()
export class UserEmailerService {
    private transporter;
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: env.EMAIL,
                pass: env.EMAIL_PASSWORD
            }
        })
    }
    async sendVerificationCode(data: EmailVerificationData) {
        return this.transporter.sendMail({
            from: env.EMAIL,
            to: data.email,
            subject: 'Verify your email',
            html: `
            <center>
                <h1> Verification code </h1>
                <div style='padding: 1rem; border-radius: 0.8rem; background-color: rgb(219, 0, 97); color: white; font-size:1.5rem'>
                    ${data.token}
                </div>
                <div style="margin-top: 1rem; color: gray;">
                    Finish your registration by putting this code in the registration page.
                </div>
            </center>
            `
        })
    }
    async sendPasswordResetCode(data: PasswordResetData) {
        return this.transporter.sendMail({
            from: env.EMAIL,
            to: data.email,
            subject: 'Verify your email',
            html: `
            <center>
                <h1> Password reset </h1>
                <div style='padding: 1rem; border-radius: 0.8rem; background-color: rgb(219, 0, 97); color: white; font-size:1.5rem''>
                    ${data.token}
                </div>
                <div style="margin-top: 1rem; color: gray;">
                    Put this code to reset your password
                </div>
            </center>
            `
        })
    }
}