import connection from '../../src/database'

export async function createRecommendation( { name, youtubeLink, score } : { name?:string, youtubeLink?:string, score?:number } ) : Promise<{id:number, name:string, youtubeLink:string, score:number }> {
    const data = {
        name: name || "Falamansa - Xote dos Milagres",
	    youtubeLink: youtubeLink || "https://www.youtube.com/watch?v=chwyjJbcs1Y",
        score: score || 0
    }

    const initialScore = 0
    
    const result = await connection.query(
        `INSERT INTO
         recommendations (name, "youtubeLink", score)
         VALUES ($1, $2, $3)
         RETURNING *`,
         [data.name, data.youtubeLink , initialScore]
    )

    return result.rows[0]
}

export async function populateRecommendationDatabase(){
    for (let i=0; i<10; i++){
        let score = Math.floor(Math.random() * 70) - 5
        await createRecommendation({score})
    }
}