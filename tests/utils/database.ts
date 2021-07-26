import connection from "../../src/database";

export async function clearDatabase() {
    await connection.query(`TRUNCATE recommendations RESTART IDENTITY`);
    await connection.query(`TRUNCATE genres RESTART IDENTITY`);
    await connection.query(`TRUNCATE classifications RESTART IDENTITY`);
}

export async function endConnection() {
    await connection.end();
}