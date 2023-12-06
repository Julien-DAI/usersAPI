import { FastifyReply, FastifyRequest } from "fastify"
import type * as s from 'zapatos/schema'
import * as db from 'zapatos/db'
import pool from '../../../common/db/pgPool'

export const listMatchs =
    async (request: FastifyRequest, reply: FastifyReply) => {

        return db.sql<s.matchs.SQL, s.matchs.Selectable[]>`SELECT * FROM ${"matchs"}`
            .run(pool)
            .then((matchs) => ({ data: matchs }))
         //Or .then((users) => reply.send({ data: users }))
    }