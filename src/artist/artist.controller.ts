import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';

@Controller('artists')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) { }

  @Post()
  async create(@Body() dto: CreateArtistDto) {
    return this.artistService.create(dto)
  }

  @Get()
  async findAll() {
    return this.artistService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.artistService.findOne(id)
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.artistService.delete(id)
  }
}
