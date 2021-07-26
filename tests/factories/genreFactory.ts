import connection from "../../src/database";

export async function createGenre( { name } : { name?:string} ) : Promise <{id:number, name:string}> {
    const newGenre = {
        name: name || "test"
    }

    const result = await connection.query(
        `INSERT INTO
         genres (name)
         VALUES ($1)
         RETURNING *`,
         [name]
    )
    
    return result.rows[0]
}