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