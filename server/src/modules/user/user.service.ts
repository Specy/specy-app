import { Prisma } from '.prisma/client'
import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import { IdGeneratorService } from 'src/modules/commons/services/id-generator.service'
import { ChangePasswordDto } from './dtos/change-password.dto'
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
	async changePassword(data: ChangePasswordDto) {
		return this.prismaService.user.update({
			where: { email: data.email },
			data: { password: data.password }
		})
	}
	async storeVerificationToken(email: string) {
		let exists = await this.prismaService.verificationToken.findUnique({ where: { email: email } })
		let token = this.idGeneratorService.randomStringId(8)
		if (exists) {
			await this.prismaService.verificationToken.delete({ where: { email: email } })
		}
		await this.prismaService.verificationToken.create({ data: { email: email, token: token } })
		return token
	}
	async deleteVerificationCodes(email:string){
		return this.prismaService.verificationToken.delete({ where: { email: email } })
	}
	async getVerificationToken(email: string) {
		return this.prismaService.verificationToken.findUnique({ where: { email: email } })
	}
}
