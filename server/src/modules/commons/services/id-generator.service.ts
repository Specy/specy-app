import { customAlphabet } from 'nanoid'
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
import { Injectable } from '@nestjs/common'

@Injectable()
export class IdGeneratorService {
    randomStringId(length: number = 12): string {
        const nanoid = customAlphabet(alphabet, length)
        return nanoid()
    }
    randomNumberId(max = 100000): number{
        return Math.floor(Math.random() * (max * 9) + max)
    }
}