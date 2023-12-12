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
            winner:null,
            status:0,

        }).run(pool);

        const newRound = await db.insert('rounds', {
            match_id:newMatch['id'],
            creature1_id:null,
            creature2_id:null,
            creature_winner:null,
            round_number:1,
            status:0

        }).run(pool);

        reply.send({ data: newMatch, newRound });
    } catch (error) {
        console.error(error);
        reply.code(500).send({ error: 'Internal Server Error' });
    }
};

export const updateMatch = async (
    request: FastifyRequest<{ Params: { id: number }; Body: Partial<s.matchs.Updatable> }>,
    reply: FastifyReply
) => {
    const matchId = request.params.id;
    const updatedData = request.body;
    let updatedMatch = [];

    try {
        if (updatedData.winner!=null) {
            updatedMatch = await db.sql<s.matchs.SQL, s.matchs.Selectable[]>`
            UPDATE ${"matchs"}
            SET ${"winner"} = ${db.param(updatedData.winner)}
            WHERE ${"id"} = ${db.param(matchId)}
            RETURNING *;
        `.run(pool);
        }
        if (updatedData.status!=null) {
            updatedMatch = await db.sql<s.matchs.SQL, s.matchs.Selectable[]>`
            UPDATE ${"matchs"}
            SET ${"status"} = ${db.param(updatedData.status)}
            WHERE ${"id"} = ${db.param(matchId)}
            RETURNING *;
        `.run(pool);
        }

        if (updatedMatch.length === 0) {
            reply.code(404).send({ error: 'Round not found' });
        } else {
            reply.send({ data: updatedMatch[0] });
        }
    } catch (error) {
        console.error(error);
        reply.code(500).send({ error: 'Internal Server Error' });
    }
};

