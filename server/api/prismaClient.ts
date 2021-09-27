import { PrismaClient } from '@prisma/client'
import { customAlphabet } from 'nanoid';
const db = new PrismaClient()
const users = db.user;
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function randomId(length: number = 12) {
    const nanoid = customAlphabet(alphabet, length);
    return nanoid()
}
export {
    db,
    users,
    randomId
}