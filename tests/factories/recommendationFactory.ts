import connection from '../../src/database'

export async function createRecommendation( { name, youtubeLink } : { name?:string, youtubeLink?:string } ) {
    const data = {
        name: name || "Falamansa - Xote dos Milagres",
	    youtubeLink: youtubeLink || "https://www.youtube.com/watch?v=chwyjJbcs1Y",
    }

    const initialScore = 0
    
    await connection.query(
        `INSERT INTO
         recommendations (name, "youtubeLink", score)
         VALUES ($1, $2, $3)
         RETURNING *`,
         [data.name, data.youtubeLink , initialScore]
    )
}