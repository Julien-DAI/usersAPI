import { FastifyReply, FastifyRequest } from "fastify"
import {Creature} from "../interfaces";

import type * as s from 'zapatos/schema'
import * as db from 'zapatos/db'
import pool from '../../../common/db/pgPool'
import console from "console";

export const listCreatures =
    async (request: FastifyRequest, reply: FastifyReply) => {

        return db.sql<s.creatures.SQL, s.creatures.Selectable[]>`SELECT * FROM ${"creatures"}`
            .run(pool)
            .then((creatures) => ({ data: creatures }))
        //Or .then((users) => reply.send({ data: users }))
    }

export const addCreature = async (
    request: FastifyRequest<{ Body: Pick<s.creatures.Insertable, 'name'| 'price' | 'hp' | 'atk'> }>,
    reply: FastifyReply
) => {
    const { name, price, hp, atk } = request.body;

    try {
        const newCreature = await db.insert('creatures', {

            name,
            price,
            hp,
            atk,

        }).run(pool);

        reply.send({ data: newCreature });
    } catch (error) {
        console.error(error);
        reply.code(500).send({ error: 'Internal Server Error' });
    }
};

