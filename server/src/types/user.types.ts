export interface EmailVerificationData{
    email: string;
    token: number;
}
export interface PasswordResetData{
    email: string;
    token: string;
}