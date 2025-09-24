import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { artistStub } from './stubs/artist.stub';
import { v4 as uuid } from 'uuid'

const artist = artistStub()

const dto = {
  name: 'Lil Peep',
  genre: 'Emo rap'
};

jest.mock('./artist.service')

describe('Artist Controller', () => {
  let controller: ArtistController;
  let service: ArtistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArtistController],
      providers: [ArtistService],
    }).compile();

    controller = module.get<ArtistController>(ArtistController);
    service = module.get<ArtistService>(ArtistService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an array of artists', async () => {
    const result = await controller.findAll()

    expect(result).toEqual([artist])
  });

  it('should return one artist by id', async () => {
    const result = await controller.findOne(artist.id)

    expect(result).toEqual(artist)
  });

  it(`shouldn't return a non-existent artist`, async () => {
    jest
      .spyOn(service, 'findOne')
      .mockRejectedValueOnce(new NotFoundException('Artist not Found'))

    try {
      await controller.findOne(uuid())
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException)
      expect(error.message).toBe('Artist not Found')
    }
  });

  it('should create one artist', async () => {
    const result = await controller.create(dto)

    expect(result).toEqual(artist)
  });

  it('should delete one artist by id', async () => {
    const result = await controller.delete(artist.id)

    expect(result).toBe(true)
  });

  it(`shouldn't delete a non-existent artist`, async () => {
    jest
      .spyOn(service, 'delete')
      .mockRejectedValueOnce(new NotFoundException('Artist not Found'))

    try {
      await controller.delete(uuid())
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException)
      expect(error.message).toBe('Artist not Found')
    }
  });
});
