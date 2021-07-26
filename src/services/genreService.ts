import * as genreRepository from "../repositories/genreRepository"

export async function create(name:string) {
    const existingGenre = await genreRepository.findByName(name);
    if ( existingGenre ) throw Error("Conflict");
    await genreRepository.create(name);
}

export async function getAll() : Promise<{id:number, name:string}[]> {
    const genres = await genreRepository.getAll();
    const sortedGenres = genres.sort((a, b) => a.name > b.name ? 1 : -1);
    return sortedGenres;
}