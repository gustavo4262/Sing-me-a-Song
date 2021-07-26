import connection from "../database";

export async function create(name:string) {
    await connection.query(
        `INSERT INTO
         genres (name)
         VALUES ($1)`,
         [name]
    )
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

export async function getById(id:number) : Promise<{id:number, name:string}> {
    const result = await connection.query(
        `SELECT *
         FROM genres
         WHERE id = $1`,
         [id]
    )
    return result.rows[0]
}