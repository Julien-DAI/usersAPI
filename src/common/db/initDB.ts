import * as db from 'zapatos/db'
import pool from './pgPool'

export const initDB = async () => {
    db.sql`
    DROP TABLE matchs;
    DROP TABLE rounds;
    DROP TABLE users;
    DROP TABLE creatures;
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name	TEXT NOT NULL UNIQUE,
        password   TEXT NOT NULL,
        balance INTEGER,
        role TEXT NOT NULL,
        badges INTEGER                    
      );
    CREATE TABLE IF NOT EXISTS matchs (
        id SERIAL PRIMARY KEY,
        player1_id INTEGER,
        player2_id INTEGER,
        winner INTEGER,
        status INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS rounds (
        id SERIAL PRIMARY KEY,
        creature1_id INTEGER,
        match_id INTEGER NOT NULL,
        creature2_id INTEGER,
        creature_winner INTEGER,
        round_number INTEGER NOT NULL,
        status INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS creatures (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        price INTEGER NOT NULL,
        hp INTEGER NOT NULL,
        atk INTEGER NOT NULL
    )
      `.run(pool)
}

