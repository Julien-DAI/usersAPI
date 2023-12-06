import { FastifyReply, FastifyRequest } from "fastify"
import { IUser } from "../interfaces"
import type * as s from 'zapatos/schema'
import * as db from 'zapatos/db'
import pool from '../../../common/db/pgPool'

export const listUsers =
    async (request: FastifyRequest, reply: FastifyReply) => {
/*        return db.sql<s.users.SQL, s.users.Selectable[]>`SELECT * FROM ${"users"}`
            .run(pool)
            .then((users) => ({ data: users }))*/
        // Or .then((users) => reply.send({ data: users }))
    }


export const getUserById = async (
    request: FastifyRequest<{ Params: { id: number } }>,
    reply: FastifyReply
) => {/*
    const userId = request.params.id;

    try {
        const user = await db.sql<s.users.SQL, s.users.Selectable[]>`
      SELECT * FROM ${'users'}
      WHERE ${'user_id'} = ${db.param(userId)}
    `.run(pool);

        if (user.length === 0) {
            reply.code(404).send({ error: 'User not found' });
        } else {
            reply.send({ data: user[0] });
        }
    } catch (error) {
        console.error(error);
        reply.code(500).send({ error: 'Internal Server Error' });
    }*/
};

export const addUser = async (
    request: FastifyRequest<{ Body: Pick<s.users.Insertable, 'name' | 'password'> }>,
    reply: FastifyReply
) => {
    /*const { name, password } = request.body;

    try {
        const newUser = await db.insert('users', {
            name,
            password,
        }).run(pool);

        reply.send({ data: newUser });
    } catch (error) {
        console.error(error);
        reply.code(500).send({ error: 'Internal Server Error' });
    }*/
};

export const updateUser = async (
    request: FastifyRequest<{ Params: { id: number }; Body: Partial<s.users.Updatable> }>,
    reply: FastifyReply
) => {
    /*const userId = request.params.id;
    const updatedData = request.body;

    try {
        const updatedUser = await db.update('users', updatedData, {
            user_id: userId,
        })
            .run(pool);

        if (updatedUser.length === 0) {
            reply.code(404).send({ error: 'User not found' });
        } else {
            reply.send({ data: updatedUser[0] });
        }
    } catch (error) {
        console.error(error);
        reply.code(500).send({ error: 'Internal Server Error' });
    }*/
};