import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';
import { CreateArtistDto } from './../src/artist/dto/create-artist.dto';

const dto: CreateArtistDto = {
  name: 'Lil Peep',
  genre: 'Emo Rap'
}

describe('Artist Controller (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe())
    await app.init();

    prisma = app.get(PrismaService)
  });

  afterAll(async () => {
    await prisma.artist.deleteMany()
    await app.close()
  })

  it('POST /artists - should create one artist', async () => {
    const response = await request(app.getHttpServer())
      .post('/artists')
      .send(dto)
      .expect(201);

    expect(response.body).toMatchObject(dto);
    expect(response.body).toHaveProperty('id');
  });

  it('GET /artists/:id - should return one artist', async () => {
    const created = await request(app.getHttpServer())
      .post('/artists')
      .send(dto)
      .expect(201);

    const { id, name, genre, createdAt, updatedAt } = created.body

    const response = await request(app.getHttpServer())
      .get(`/artists/${id}`)
      .expect(200)

    expect(response.body).toMatchObject({ id, name, genre, createdAt, updatedAt })
  });

  it(`GET /artists/:id - shouldn't return a non-existent artist`, async () => {
    await request(app.getHttpServer())
      .get('/artists/non-existent-id')
      .expect(404);
  });
});
