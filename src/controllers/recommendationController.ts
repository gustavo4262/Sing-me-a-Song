import {Request, Response} from 'express'
import * as recommendationService from '../services/recommendationService'

export async function createRecommendation(req:Request, res:Response){
    try{
        const {name, youtubeLink, genresIds} = req.body;

        await recommendationService.create(name, youtubeLink, genresIds);
       
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
        res.send(recommendation);
    }
    catch(err){
        if (err.message === "Not Found") return res.sendStatus(404);
        res.sendStatus(500);
    }
}

export async function getRandomByGenreId(req:Request, res:Response) {
    try{
        const genreId = Number(req.params.id);
        if ( !genreId ) throw Error('Bad Request');
        const result = await recommendationService.getRandomByGenreId(genreId)
        res.send(result);
    }
    catch(err){
        if (err.message === 'Not Found') return res.sendStatus(404)
        if (err.message === 'Bad Request') return res.sendStatus(400)
        res.sendStatus(500);
    }
}

export async function getTop(req:Request, res:Response) {
    try{
        const amount = Number(req.params.amount);
        if(! (amount > 0) ) throw Error('Bad Request');
        const result = await recommendationService.getTop(amount);
        if (result.length === 0) throw Error('Not Found');
        res.send(result);
    }
    catch(err){
        if (err.message === 'Bad Request') return res.sendStatus(400);
        if (err.message === 'Not Found') return res.sendStatus(404);
        res.sendStatus(500);
    }
}