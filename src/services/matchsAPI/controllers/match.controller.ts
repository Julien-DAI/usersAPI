import { FastifyReply, FastifyRequest } from "fastify"
import {Match} from "../interfaces";

import type * as s from 'zapatos/schema'
import * as db from 'zapatos/db'
import pool from '../../../common/db/pgPool'
import console from "console";

export const listMatchs =
    async (request: FastifyRequest, reply: FastifyReply) => {

        return db.sql<s.matchs.SQL, s.matchs.Selectable[]>`SELECT * FROM ${"matchs"}`
            .run(pool)
            .then((matchs) => ({ data: matchs }))
         //Or .then((users) => reply.send({ data: users }))
    }

export const addMatch = async (
    request: FastifyRequest<{ Body: Pick<s.matchs.Insertable, 'player1_id'| 'player2_id' | 'winner' | 'status'> }>,
    reply: FastifyReply
) => {

    const { player1_id, player2_id, winner, status } = request.body;

    try {
        const newMatch = await db.insert('matchs', {

            player1_id,
            player2_id,
            winner,
            status,

        }).run(pool);

        reply.send({ data: newMatch });
    } catch (error) {
        console.error(error);
        reply.code(500).send({ error: 'Internal Server Error' });
    }
};

