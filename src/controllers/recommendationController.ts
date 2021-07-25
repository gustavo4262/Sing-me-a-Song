import {Request, Response} from 'express'
import * as recommendationService from '../services/recommendationService'

export async function createRecommendation(req:Request, res:Response){
    try{
        const {name, youtubeLink} = req.body

        await recommendationService.create(name, youtubeLink)
       
        return res.sendStatus(201)
    }
    catch(err){
        if (err.message === 'Bad Request') return res.sendStatus(400)
        if (err.message === 'Conflict' ) return res.sendStatus(409)
        return res.sendStatus(500)
    }

}