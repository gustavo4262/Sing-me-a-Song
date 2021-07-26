import { recommendationSchema } from '../schemas'
import * as recommendationRepository from '../repositories/recommendationRepository'
import * as genreRepository from '../repositories/genreRepository'


export async function create (name:string, youtubeLink:string, genresIds:number[]) {
    try{
        await recommendationSchema.validateAsync({name, youtubeLink})
    }
    catch(err) {
        throw Error("Bad Request")
    }

    const isAvailable = await recommendationRepository.checkNewRecommendationIsAvailable(name, youtubeLink);
    if (!isAvailable){
        throw Error("Conflict")
    }

    const rec = await recommendationRepository.create(name, youtubeLink)

    Promise.all(
        genresIds.map(async (genreId) => {
            const genreExists = await genreRepository.checkExists(genreId);
            if (!genreExists) throw Error('Not Found')
            await recommendationRepository.createClassification(genreId, rec.id)
        })
    )
    
}

export async function changeScore(id:number, type:string){
    const recommendationExists = await recommendationRepository.checkRecommendationExists(id);
   
    if ( !recommendationExists )
        throw Error('Not Found')
    
    if (type === "upvote")
        upvote(id)
    
    else if (type === 'downvote')
        downvote(id)
    
    else 
        throw Error(`parameter type "${type}" should be either upvote or downvote`)
}

async function upvote(id:number) {
    await recommendationRepository.upvote(id)
}

async function downvote(id:number) {
    const result = await recommendationRepository.downvote(id)
    if (result.score < -5)
        await recommendationRepository.remove(id);
}

export async function getRandom() : Promise <{id:number, name:string, youtubeLink:string, score:number}> {
    const recommendations = await recommendationRepository.getAll();

    if (recommendations.length === 0) throw Error('Not Found')

    const sortedRecommendations = recommendations.sort((a, b) => a.score > b.score ? 1 : -1);
    const firstHighScoreIndex = recommendations.findIndex(a => a.score >= 10 );
    const randomNumber = Math.random();
    let arrayUsed, index

    if (randomNumber < 0.7){
        arrayUsed = sortedRecommendations.slice(firstHighScoreIndex);
        index = Math.floor( randomNumber * arrayUsed.length / 0.7 );
    }
    else{
        arrayUsed = sortedRecommendations.slice(0, firstHighScoreIndex);
        index = Math.floor( (randomNumber - 0.7) *  arrayUsed.length / 0.3 );
    }
    if (arrayUsed[index] === undefined) console.log(arrayUsed, index, randomNumber)
    return arrayUsed[index]
}

export async function getRandomByGenreId(genreId:number) {
    const genre = await genreRepository.getById(genreId);
    if ( !genre ) throw Error('Not Found') 
    
    const recArray : { 
        id:number, 
        name:string, 
        youtubeLink:string,
        score:number, 
        genres: { id:number, name:string }[] } [] = []

    const recommendations = await recommendationRepository.getAllFromGenreId(genreId);
    await Promise.all(
        recommendations.map(async (rec) => {
            const recGenres = await genreRepository.getAllFromRecommendationId(rec.id);
            const recObject = {id: rec.id, name:rec.name, youtubeLink:rec.youtubeLink, score:rec.score, genres:recGenres}
            recArray.push(recObject)
    }))

    const randomIndex = Math.floor( Math.random() * recArray.length );
    return recArray[randomIndex]
}

export async function getTop(amount:number) : Promise <{id:number, name:string, youtubeLink:string, score:number}[]>{
    const recommendations = await recommendationRepository.getAll();
    const sortedRecommendations = recommendations.sort((a, b) => a.score > b.score ? -1 : 1);
    const result = sortedRecommendations.slice(0, amount)
    return result;
}