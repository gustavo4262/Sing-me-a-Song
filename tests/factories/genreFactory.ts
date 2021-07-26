import connection from "../../src/database";
import faker from 'faker'

export async function createGenre( { name } : { name?:string} ) : Promise <{id:number, name:string}> {
    const newGenre = {
        name: name || faker.music.genre()
    }

    const result = await connection.query(
        `INSERT INTO
         genres (name)
         VALUES ($1)
         RETURNING *`,
         [newGenre.name]
    )
    
    return result.rows[0]
}

export async function populateDatabase(){
    for (let i=0; i<10; i++){
        let name = faker.music.genre();
        await createGenre( { name } )
    }
}