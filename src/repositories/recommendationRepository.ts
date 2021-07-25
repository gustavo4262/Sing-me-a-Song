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
