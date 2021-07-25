import { recommendationSchema } from '../schemas'
import * as recommendationRepository from '../repositories/recommendationRepository'


export async function create (name:string, youtubeLink:string) {
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

    await recommendationRepository.create(name, youtubeLink)
    
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

export async function getRandom() {
    const recommendations = await recommendationRepository.getAll();

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