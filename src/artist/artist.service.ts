import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ArtistService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(dto: CreateArtistDto) {
    return await this.prismaService.artist.create({
      data: {
        name: dto.name,
        genre: dto.genre
      }
    })
  }

  async findAll() {
    return await this.prismaService.artist.findMany({});
  }

  async findOne(id: string) {
    const artist = await this.prismaService.artist.findUnique({
      where: {
        id
      }
    })

    if (!artist) throw new NotFoundException('Такого исполнителя не существует')

    return artist
  }

  async delete(id: string) {
    const artist = await this.prismaService.artist.findUnique({
      where: {
        id
      }
    })

    if (!artist) throw new NotFoundException('Такого исполнителя не существует')

    await this.prismaService.artist.delete({
      where: {
        id: artist.id
      }
    })

    return true
  }
}
