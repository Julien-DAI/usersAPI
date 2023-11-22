import { FastifyReply, FastifyRequest } from "fastify"
import { IUser } from "interfaces"
import type * as s from 'zapatos/schema'
import * as db from 'zapatos/db'
import pool from '../db/pgPool'

const staticUsers: IUser[] = [
    {
        id: 1,
        name: 'Joyce Byers'
    },
    {
        id: 2,
        name: 'Chuck Norris'
    },
    {
        id: 3,
        name: 'Bruce Wayne'
    },
    {
        id: 4,
        name: 'The Rock'
    }
]

export const listUsers =
    async (request: FastifyRequest, reply: FastifyReply) => {
        return db.sql<s.users.SQL, s.users.Selectable[]>`SELECT * FROM ${"users"}`
            .run(pool)
            .then((users) => ({ data: users }))
        // Or .then((users) => reply.send({ data: users }))
    }


export const getUserById = async (
    request: FastifyRequest<{ Params: { id: number } }>,
    reply: FastifyReply) => {

    Promise.resolve(staticUsers)
        .then((users) => {
            const userId = request.params.id;
            const user = users.find((u) => u.id == userId);

            if (!user) {
                reply.code(404).send({ error: 'Utilisateur non trouvé' });
            }

            reply.send({ data: user })
        })
}

export const addUser = async (
    request: FastifyRequest<{ Body: { name: string } }>, // Assuming you're sending user data in the request body
    reply: FastifyReply
) => {
    try {
        const newUser: IUser = {
            id: staticUsers.length + 1,
            name: request.body.name,
        };

        staticUsers.push(newUser);


        reply.code(201).send({ data: newUser });
    } catch (error) {
        reply.code(500).send({ error: 'Internal Server Error' });
    }
};

export const updateUser = async (
    request: FastifyRequest<{ Params: { id: string }; Body: { score: number } }>,
    reply: FastifyReply
) => {
    try {
        const userId = parseInt(request.params.id, 10);
        const userIndex = staticUsers.findIndex((u) => u.id === userId);

        if (userIndex === -1) {
            reply.code(404).send({ error: 'Utilisateur non trouvé' });
            return;
        }

        staticUsers[userIndex].score = request.body.score;

        reply.send({ data: staticUsers[userIndex] });
    } catch (error) {
        reply.code(500).send({ error: 'Internal Server Error' });
    }
};