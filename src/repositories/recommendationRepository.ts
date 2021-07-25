import connection from '../database'

export async function create(name:string, youtubeLink:string) {
    const initialScore = 0;
    await connection.query(
        `INSERT INTO
         recommendations (name, "youtubeLink", score)
         VALUES ($1, $2, $3)`,
         [name, youtubeLink, initialScore]
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