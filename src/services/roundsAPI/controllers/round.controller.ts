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

    const { match_id, creature1_id, creature2_id, round_number } = request.body;

    try {
        const newRound = await db.insert('rounds', {
            match_id,
            creature1_id,
            creature2_id,
            creature_winner:null,
            round_number,
            status:0,

        }).run(pool);

        reply.send({ data: newRound });
    } catch (error) {
        console.error(error);
        reply.code(500).send({ error: 'Internal Server Error' });
    }
};


export const updateRound = async (
    request: FastifyRequest<{ Params: { id: number }; Body: Partial<s.rounds.Updatable> }>,
    reply: FastifyReply
) => {
    const roundId = request.params.id;
    const updatedData = request.body;
    let updatedRound = [];

    try {
        if (updatedData.creature_winner!=null) {
            updatedRound = await db.sql<s.rounds.SQL, s.rounds.Selectable[]>`
            UPDATE ${"rounds"}
            SET ${"creature_winner"} = ${db.param(updatedData.creature_winner)}
            WHERE ${"id"} = ${db.param(roundId)}
            RETURNING *;
        `.run(pool);
        }
        if (updatedData.status!=null) {
            updatedRound = await db.sql<s.rounds.SQL, s.rounds.Selectable[]>`
            UPDATE ${"rounds"}
            SET ${"status"} = ${db.param(updatedData.status)}
            WHERE ${"id"} = ${db.param(roundId)}
            RETURNING *;
        `.run(pool);
        }

        if (updatedRound.length === 0) {
            reply.code(404).send({ error: 'Round not found' });
        } else {
            reply.send({ data: updatedRound[0] });
        }
    } catch (error) {
        console.error(error);
        reply.code(500).send({ error: 'Internal Server Error' });
    }
};