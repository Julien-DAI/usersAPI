import { FastifyReply, FastifyRequest } from "fastify"
import type * as s from 'zapatos/schema'
import * as db from 'zapatos/db'
import pool from '../../../common/db/pgPool'
import console from "console";

export const listRounds =
    async (request: FastifyRequest, reply: FastifyReply) => {

        return db.sql<s.rounds.SQL, s.rounds.Selectable[]>`SELECT * FROM ${"rounds"}`
            .run(pool)
            .then((rounds) => ({ data: rounds }))
        //Or .then((users) => reply.send({ data: users }))
    }


export const addRound = async (
    request: FastifyRequest<{ Body: Pick<s.rounds.Insertable, 'match_id' | 'creature1_id'| 'creature2_id' | 'creature_winner' | 'round_number' | 'status'> }>,
    reply: FastifyReply
) => {

    const { match_id, creature1_id, creature2_id, creature_winner, round_number, status } = request.body;

    try {
        const newRound = await db.insert('rounds', {
            match_id,
            creature1_id,
            creature2_id,
            creature_winner,
            round_number,
            status,

        }).run(pool);

        reply.send({ data: newRound });
    } catch (error) {
        console.error(error);
        reply.code(500).send({ error: 'Internal Server Error' });
    }
};
