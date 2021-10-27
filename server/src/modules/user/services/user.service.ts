import { Prisma } from '.prisma/client';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(data: Prisma.UserCreateInput) {
    const exists = await this.findUnique({ email: data.email });
    if (exists) throw new BadRequestException('Email already in use. ');
    return this.prismaService.user.create({ data });
  }
  async findUnique(data: Prisma.UserWhereUniqueInput) {
    return this.prismaService.user.findUnique({ where: data });
  }
  async remove(data: Prisma.UserWhereUniqueInput) {
    return this.prismaService.user.delete({ where: data });
  }
}
