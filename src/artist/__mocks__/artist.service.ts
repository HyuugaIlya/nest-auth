import { artistStub } from "../stubs/artist.stub"

const artist = artistStub()

export const ArtistService = jest.fn().mockReturnValue({
  findAll: jest.fn().mockResolvedValue([artist]),
  findOne: jest.fn().mockResolvedValue(artist),
  create: jest.fn().mockResolvedValue(artist),
  delete: jest.fn().mockResolvedValue(true),
})
