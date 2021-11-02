import { customAlphabet } from 'nanoid'
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const easyToRead = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
import { Injectable } from '@nestjs/common'

@Injectable()
export class IdGeneratorService {
    randomStringId(length: number = 12,isEasyToRead = false): string {
        const nanoid = customAlphabet(isEasyToRead ? alphabet : easyToRead, length)
        return nanoid()
    }
    randomNumberId(max = 100000): number{
        return Math.floor(Math.random() * (max * 9) + max)
    }
}