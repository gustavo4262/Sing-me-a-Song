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