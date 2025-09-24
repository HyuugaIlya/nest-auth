import { Test, TestingModule } from '@nestjs/testing';
import { ArtistService } from './artist.service';
import { Artist } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuid } from 'uuid';

const artistId = uuid();

const artists: Artist[] = [
  {
    id: artistId,
    name: 'Lil Peep',
    genre: 'Emo Rap',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid(),
    name: 'nothing.nowhere',
    genre: 'Rap',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuid(),
    name: 'Paris Shadows',
    genre: 'Rap',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const artist: Artist = artists[0];

const dto = {
  name: artist.name,
  genre: artist.genre
};

const dbMock = {
  artist: {
    findMany: jest.fn().mockResolvedValue(artists),
    findUnique: jest.fn().mockResolvedValue(artist),
    create: jest.fn().mockResolvedValue(artist),
    delete: jest.fn().mockResolvedValue(artist),
  }
};

describe('Artist Service', () => {
  let service: ArtistService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArtistService, {
        provide: PrismaService,
        useValue: dbMock
      }],
    }).compile();

    service = module.get<ArtistService>(ArtistService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of artists', async () => {
    const result = await service.findAll();
    expect(result).toEqual(artists);
  });

  it('should return one artist by id', async () => {
    const result = await service.findOne(artistId);
    expect(result).toEqual(artist);
  });

  it('should create one artist', async () => {
    const result = await service.create(dto);
    expect(result).toEqual(artist);
  });

  it('should delete one artist by id', async () => {
    const result = await service.delete(artistId);
    expect(result).toBe(true);
  });
});
