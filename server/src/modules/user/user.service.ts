import { Prisma } from '.prisma/client'
import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import { IdGeneratorService } from 'src/modules/commons/services/id-generator.service'
@Injectable()
export class UserService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly idGeneratorService: IdGeneratorService
	) { }
	async create(data: Prisma.UserCreateInput) {
		const exists = await this.findUnique({ email: data.email })
		if (exists) throw new BadRequestException('Email already in use. ')
		return this.prismaService.user.create({ data })
	}
	async findUnique(data: Prisma.UserWhereUniqueInput) {
		return this.prismaService.user.findUnique({ where: data })
	}
	async existsMail(email: string) {
		return Boolean(await this.findUnique({ email: email }))
	}
	async remove(data: Prisma.UserWhereUniqueInput) {
		return this.prismaService.user.delete({ where: data })
	}
	async storeVerificationCode(email: string) {
		let exists = await this.prismaService.emailVerification.findUnique({ where: { email: email } })
		let token = this.idGeneratorService.randomNumberId(100000)
		if (exists) {
			await this.prismaService.emailVerification.delete({ where: { email: email } })
		}
		await this.prismaService.emailVerification.create({ data: { email: email, token: token } })
		return token
	}
	async getVerificationData(email: string) {
		return this.prismaService.emailVerification.findUnique({ where: { email: email } })
	}
}
