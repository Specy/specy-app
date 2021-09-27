import { users, db, randomId } from '../prismaClient'

interface User {
    email: string
    password: string
    username: string
}
class UserModel {
    constructor() {

    }
    async existsMail(email: string) {
        let user = await this.getUserByMail(email)
        console.log(user)
        return user !== null
    }
    async existsId(id: string) {
        let user = await users.findUnique({
            where: {
                id: id
            }
        })
        return user
    }
    async getUserByMail(email: string) {
        let user = await users.findUnique({
            where: {
                email: email
            }
        })
        return user
    }
    async getUserById(id: string) {
        let user = await users.findUnique({
            where: {
                id: id
            }
        })
        return user
    }
    async addUser(data: User) {
        if (await this.existsMail(data.email)) throw new Error('User already exists')
        let user = await users.create({
            data: {
                id: randomId(12),
                email: data.email,
                username: data.username,
                password: data.password
            }
        })
        return user
    }
}



export default new UserModel()