import * as genreRepository from "../repositories/genreRepository"
import * as recommendationRepository from '../repositories/recommendationRepository'

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

export async function getById(id:number){
    const genre = await genreRepository.getById(id);
    if ( !genre ) throw Error('Not Found') 
    
    let result : Record<string, any> = { id:genre.id, name:genre.name, score:genre.score, recommendations: []}

    const recommendations = await recommendationRepository.getAllFromGenreId(id);
    await Promise.all(
        recommendations.map(async (rec) => {
            const recGenres = await genreRepository.getAllFromRecommendationId(rec.id);
            const recObject = {id: rec.id, name:rec.name, youtubeLink:rec.youtubeLink, score:rec.score, genres:recGenres}
            result.recommendations.push(recObject)
    }))
    return result;
}