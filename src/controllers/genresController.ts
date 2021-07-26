import { Request, Response } from 'express'
import * as genreService from "../services/genreService"

export async function create(req:Request, res:Response) {
    try{
        const { name } = req.body

        await genreService.create(name)

        res.sendStatus(201)
    }
    catch(err) {
        if (err.message === "Conflict") return res.sendStatus(409);
        res.sendStatus(500)
    }
}

export async function getAll(req:Request, res:Response) {
    try{
        const allGenres = await genreService.getAll();
        if (allGenres.length === 0) throw Error('Not Found');
        res.send(allGenres);
    }
    catch(err) {
        if (err.message === 'Not Found') return res.sendStatus(404);
        res.sendStatus(500);
    }
}