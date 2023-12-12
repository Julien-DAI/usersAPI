import { FastifyReply, FastifyRequest } from "fastify"
import { ExtendedUser, UserRole, IUser } from "../interfaces"
import type * as s from 'zapatos/schema'
import * as db from 'zapatos/db'
import pool from '../../../common/db/pgPool'

export const listUsers =
    async (request: FastifyRequest, reply: FastifyReply) => {
        return db.sql<s.users.SQL, s.users.Selectable[]>`SELECT * FROM ${"users"}`
            .run(pool)
            .then((users) => ({ data: users }))
        // Or .then((users) => reply.send({ data: users }))
    }


export const getUserById = async (
    request: FastifyRequest<{ Params: { id: number } }>,
    reply: FastifyReply
) => {
    const userId = request.params.id;

    try {
        const user = await db.sql<s.users.SQL, s.users.Selectable[]>`
      SELECT * FROM ${'users'}
      WHERE id = ${db.param(userId)}
    `.run(pool);

        if (user.length === 0) {
            reply.code(404).send({ error: 'User not found' });
        } else {
            reply.send({ data: user[0] });
        }
    } catch (error) {
        console.error(error);
        reply.code(500).send({ error: 'Internal Server Error' });
    }
};

export const addUser = async (
    request: FastifyRequest<{ Body: Omit<ExtendedUser, 'id'> }>,
    reply: FastifyReply
) => {
    const { name, role, password } = request.body;

    try {
        // Construct the newUser object based on the determined role
        let newUser: Omit<ExtendedUser, 'id'>;

        switch (role) {
            case 'player':
                newUser = { name, role, badges:0, password } as Omit<ExtendedUser, 'id'>;
                break;
            case 'reporter':
                newUser = { name, role, password };
                break;
            case 'admin':
                newUser = { name, role, password };
                break;
            default:
                // Handle unexpected role
                throw new Error('Invalid user role');
        }

        // Insert the newUser into the database
        const insertedUser = await db.insert('users', newUser).run(pool);

        reply.send({ data: insertedUser });
    } catch (error) {
        console.error(error);
        reply.code(500).send({ error: 'Internal Server Error' });
    }
};


export const updateUser = async (
    request: FastifyRequest<{ Params: { id: number }; Body: Partial<s.users.Updatable> }>,
    reply: FastifyReply
) => {
    const userId = request.params.id;
    const updatedData = request.body;
    let updatedUsers = [];

    try {
        if (updatedData.name!=null) {
            updatedUsers = await db.sql<s.users.SQL, s.users.Selectable[]>`
            UPDATE ${"users"}
            SET ${"name"} = ${db.param(updatedData.name)}
            WHERE ${"id"} = ${db.param(userId)}
            RETURNING *;
        `.run(pool);
        }
        if (updatedData.badges!=null) {
            updatedUsers = await db.sql<s.users.SQL, s.users.Selectable[]>`
            UPDATE ${"users"}
            SET ${"badges"} = ${db.param(updatedData.badges)}
            WHERE ${"id"} = ${db.param(userId)}
            RETURNING *;
        `.run(pool);
        }
        if (updatedData.password!=null) {
            updatedUsers = await db.sql<s.users.SQL, s.users.Selectable[]>`
            UPDATE ${"users"}
            SET ${"password"} = ${db.param(updatedData.password)}
            WHERE ${"id"} = ${db.param(userId)}
            RETURNING *;
        `.run(pool);
        }



        if (updatedUsers.length === 0) {
            reply.code(404).send({ error: 'User not found' });
        } else {
            reply.send({ data: updatedUsers[0] });
        }
    } catch (error) {
        console.error(error);
        reply.code(500).send({ error: 'Internal Server Error' });
    }
};