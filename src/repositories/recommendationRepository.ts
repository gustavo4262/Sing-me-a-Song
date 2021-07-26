import connection from '../database'

export async function create(name:string, youtubeLink:string) : Promise <{id:number, name:string, youtubeLink:string, score:number}> {
    const initialScore = 0;
    const result = await connection.query(
        `INSERT INTO
         recommendations (name, "youtubeLink", score)
         VALUES ($1, $2, $3)
         RETURNING *`,
         [name, youtubeLink, initialScore]
    )
    return result.rows[0]
}

export async function createClassification(genreId:number, recommendationId:number) {
    await connection.query(
        `INSERT INTO
         classifications ("genreId", "recommendationId")
         VALUES ($1, $2)`,
         [genreId, recommendationId]
    )
}

export async function checkNewRecommendationIsAvailable(name:string, youtubeLink:string) : Promise<boolean> {
    const result = await connection.query(
        `SELECT *
         FROM recommendations
         WHERE name = $1 OR "youtubeLink" = $2`,
         [name, youtubeLink]
    )
    return result.rowCount === 0
}

export async function checkRecommendationExists(id:number) : Promise<boolean> {
    const result = await connection.query(
        `SELECT *
         FROM recommendations
         WHERE id = $1`,
         [id]
    )
    return result.rowCount !== 0
}

export async function upvote(id:number) : Promise <{score:Number}> {
    const result = await connection.query(
        `UPDATE recommendations
         SET score = score + 1
         WHERE id = $1
         RETURNING score`,
         [id]
    )
    return result.rows[0]
}

export async function downvote(id:number) : Promise <{score:Number}> {
    const result = await connection.query(
        `UPDATE recommendations
         SET score = score - 1
         WHERE id = $1
         RETURNING score`,
         [id]
    )
    return result.rows[0]
}

export async function remove(id:number) {
    await connection.query(
        `DELETE FROM recommendations
         WHERE id = $1`,
         [id]
    )
}

export async function getAll() : Promise <{id:number, name:string, youtubeLink:string, score:number}[]>{
    const result = await connection.query(
        `SELECT *
         FROM recommendations`
    )
    return result.rows
}

export async function getAllFromGenreId(genreId:number) : Promise <{id:number, name:string, youtubeLink:string, score:number}[]>{
    const result = await connection.query(
        `SELECT r.*
         FROM recommendations AS r
         JOIN classifications AS c
         ON r.id = c."recommendationId"
         JOIN genres AS g
         on c."genreId" = g.id
         WHERE g.id = $1`,
         [genreId]
    )
    return result.rows
}