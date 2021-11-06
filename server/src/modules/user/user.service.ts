import { Prisma } from '.prisma/client'
import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import { IdGeneratorService } from 'src/modules/commons/services/id-generator.service'
import { ChangePasswordDto } from './dtos/change-password.dto'
import { WhitelistDAO } from './daos/jwt.dao'

@Injectable()
export class UserService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly idGeneratorService: IdGeneratorService
	) { }
	async create(data: Prisma.UserCreateInput) {
		const exists = await this.findUnique({ email: data.email })
		if (exists) throw new BadRequestException('Email already in use')
		return this.prismaService.user.create({ data })
	}
	async findUnique(data: Prisma.UserWhereUniqueInput) {
		return this.prismaService.user.findUnique({ where: data })
	}
	async existsMail(email: string) {
		return Boolean(await this.findUnique({ email: email }))
	}
	async deleteUser(data: Prisma.UserWhereUniqueInput) {
		return this.prismaService.user.delete({ where: data })
	}
	async updateUser( where: Prisma.UserWhereUniqueInput,data: Prisma.UserUpdateInput) {
		return this.prismaService.user.update({where, data})
	}
	async get(id: string, data: Prisma.UserSelect){
		return this.prismaService.user.findUnique({where:{id},select:{...data}})
	}
	async whitelistToken(newToken:WhitelistDAO,oldToken?:string,){
		return this.prismaService.whitelistedSession.upsert({
			where:{token: oldToken},
			create: newToken,
			update:{ token: newToken.token, expiry: newToken.expiry}
		})
	}
	async changePassword(data: ChangePasswordDto) {
		return this.prismaService.user.update({
			where: { email: data.email },
			data: { password: data.password }
		})
	}
	async storeVerificationToken(email: string) {
		let token = this.idGeneratorService.randomStringId(8)
		await this.prismaService.verificationToken.upsert({ 
			update: { token: token },
			where:{email:email},
			create: {email: email, token:token}
		})
		return token
	}
	async deleteVerificationCodes(email:string){
		return this.prismaService.verificationToken.delete({ where: { email: email } })
	}
	async getVerificationToken(email: string) {
		return this.prismaService.verificationToken.findUnique({ where: { email: email } })
	}
}
