import * as db from 'zapatos/db'
import pool from '../db/pgPool'

export const initDB = async () => {
    db.sql`
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name	TEXT NOT NULL UNIQUE,
        password   TEXT NOT NULL
      ) 
      `.run(pool)
}