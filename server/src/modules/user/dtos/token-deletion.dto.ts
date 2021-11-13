import { IsNumber } from "class-validator";

export class TokenDeletionDto{
    @IsNumber()
    id: number
}