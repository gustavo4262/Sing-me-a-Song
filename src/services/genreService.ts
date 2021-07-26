import * as genreRepository from "../repositories/genreRepository"

export async function create(name:string) {
    const existingGenre = await genreRepository.findByName(name);
    if ( existingGenre ) throw Error("Conflict")
    await genreRepository.create(name)
}