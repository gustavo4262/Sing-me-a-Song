import connection from "../database";

export async function create(name:string) {
    await connection.query(
        `INSERT INTO
         genres (name)
         VALUES ($1)`,
         [name]
    )
}

export async function checkExists(id:number) : Promise<boolean> {
    const result = await connection.query(
        `SELECT *
         FROM genres
         WHERE id = $1`,
         [id]
    )
    return result.rowCount !== 0;
}

export async function findByName(name:string) {
    const result = await connection.query(
        `SELECT *
         FROM genres
         WHERE name = $1`,
         [name]
    )
    return result.rows[0]
}

export async function getAll() : Promise<{id:number, name:string}[]> {
    const result = await connection.query(
        `SELECT *
         FROM genres`
    )
    return result.rows
}

export async function getById(id:number) : Promise<{id:number, name:string, score:number}> {
    const result = await connection.query(
        `SELECT g.id, g.name, SUM(score) AS score
         FROM genres AS g
         JOIN classifications AS c
         ON g.id = c."genreId"
         JOIN recommendations AS r
         ON c."recommendationId" = r.id
         WHERE g.id = $1
         GROUP BY (g.id, g.name)`,
         [id]
    )
    return result.rows[0]
}

export async function getAllFromRecommendationId(recommendationId:number) : Promise<{id:number, name:string}[]> {
    const result = await connection.query(
        `SELECT g.*
         FROM recommendations AS r
         JOIN classifications AS c
         ON r.id = c."recommendationId"
         JOIN genres AS g
         on c."genreId" = g.id
         WHERE r.id = 1`
    )
    return result.rows
}