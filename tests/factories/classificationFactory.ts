import connection from "../../src/database";
import { createGenre } from "./genreFactory";
import { createRecommendation } from "./recommendationFactory";

export async function createClassification( { genreId, recommendationId } : { genreId:number, recommendationId:number } ) : Promise <{id:number, genreId:number, recommendationId:number}> {

    const result = await connection.query(
        `INSERT INTO
         classifications ("genreId", "recommendationId")
         VALUES ( $1, $2 )
         RETURNING *`,
         [genreId, recommendationId]
    )
    
    return result.rows[0]
}

export async function populateClassificationDatabase(){
    const genres = [await createGenre({}), await createGenre({}), await createGenre({})];
    const recommendations = [await createRecommendation({}), await createRecommendation({}), await createRecommendation({})]
    await Promise.all( 
        genres.map( async (genre) => {
            recommendations.forEach( async (recommendation) => {
                await createClassification( { genreId:genre.id, recommendationId:recommendation.id })
            })
        }))

}