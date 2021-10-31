import { Prisma } from '.prisma/client';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(data: Prisma.UserCreateInput) {
    const exists = await this.findUnique({ email: data.email })
    if (exists) throw new BadRequestException('Email already in use. ')
    return this.prismaService.user.create({ data })
  }
  async findUnique(data: Prisma.UserWhereUniqueInput) {
    return this.prismaService.user.findUnique({ where: data })
  }
  async existsMail(email: string){
    return Boolean(await this.findUnique({email: email}))
  }
  async remove(data: Prisma.UserWhereUniqueInput) {
    return this.prismaService.user.delete({ where: data })
  }
  async verifyEmail(data: Prisma.EmailVerificationCreateInput){
    if(await this.prismaService.emailVerification.findUnique({where: {email:data.email}})){
      await this.prismaService.emailVerification.delete({where: {email: data.email}})
    }
 
    return this.prismaService.emailVerification.create({ data })
  }
  async getVerificationData(email:string){
    return this.prismaService.emailVerification.findUnique({where: {email:email}})
  }
}
