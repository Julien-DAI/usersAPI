import { FastifyReply, FastifyRequest } from "fastify"
import type * as s from 'zapatos/schema'
import * as db from 'zapatos/db'
import pool from '../../../common/db/pgPool'

export const listRounds =
    async (request: FastifyRequest, reply: FastifyReply) => {

        return db.sql<s.rounds.SQL, s.rounds.Selectable[]>`SELECT * FROM ${"rounds"}`
            .run(pool)
            .then((rounds) => ({ data: rounds }))
        //Or .then((users) => reply.send({ data: users }))
    }