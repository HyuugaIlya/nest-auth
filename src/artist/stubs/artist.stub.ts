import { v4 as uuid } from 'uuid'

const artistId = uuid()

export function artistStub() {
    return {
        id: artistId,
        name: 'Lil Peep',
        genre: 'Emo rap'
    }
}