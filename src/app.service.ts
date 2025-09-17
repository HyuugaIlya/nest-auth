import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './infra/prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prismaService: PrismaService) { }

  async getLinkByShortCode(shortCode: string) {
    const link = await this.prismaService.link.findUnique({
      where: {
        shortCode
      }
    })

    if (!link) throw new NotFoundException('Ссылка не найдена')

    return link
  }

  async trackClick(code: string, ipAddress: string, userAgent: string) {
    const { id } = await this.getLinkByShortCode(code)

    await this.prismaService.click.create({
      data: {
        ipAddress,
        userAgent,
        link: {
          connect: {
            id
          }
        }
      }
    })
  }
}
