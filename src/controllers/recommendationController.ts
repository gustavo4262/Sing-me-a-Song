import exp from 'constants';
import {Request, Response} from 'express'
import * as recommendationService from '../services/recommendationService'

export async function createRecommendation(req:Request, res:Response){
    try{
        const {name, youtubeLink} = req.body;

        await recommendationService.create(name, youtubeLink);
       
        return res.sendStatus(201);
    }
    catch(err){
        if (err.message === 'Bad Request') return res.sendStatus(400);
        if (err.message === 'Conflict' ) return res.sendStatus(409);
        return res.sendStatus(500);
    }

}

export async function upvote(req:Request, res:Response){
    try{
        const { id } = req.params;

        await recommendationService.changeScore(Number(id), "upvote");

        res.sendStatus(200);
    }
    catch(err) {
        if (err.message === "Not Found") return res.sendStatus(404)
        res.sendStatus(500)
    }
}

export async function downvote(req:Request, res:Response){
    try{
        const { id } = req.params;

        await recommendationService.changeScore(Number(id), "downvote");

        res.sendStatus(200);
    }
    catch(err) {
        if (err.message === "Not Found") return res.sendStatus(404)
        res.sendStatus(500)
    }
}

export async function getRandom(req:Request, res:Response){
    try{    
        const recommendation = await recommendationService.getRandom();
        if ( recommendation === undefined) throw Error
        res.send(recommendation);
    }
    catch(err){
        res.sendStatus(500);
    }
}