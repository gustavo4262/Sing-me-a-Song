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