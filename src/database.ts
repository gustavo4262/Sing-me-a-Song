import pg from 'pg'

const { Pool } = pg

const connection = process.env.DATABASE_URL? new Pool({
    connectionString:process.env.DATABASE_URL
}) : new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_DATABASE
  });

export default connection