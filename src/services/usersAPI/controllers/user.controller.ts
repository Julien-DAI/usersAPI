import { FastifyReply, FastifyRequest } from "fastify"
import { ExtendedUser, UserRole } from "../interfaces"
import type * as s from 'zapatos/schema'
import * as db from 'zapatos/db'
import pool from '../../../common/db/pgPool'
import * as console from "console";

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
                newUser = { name, role, badges:0, password, balance:0 } as Omit<ExtendedUser, 'id'>;
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
        if (updatedData.balance!=null) {
            updatedUsers = await db.sql<s.users.SQL, s.users.Selectable[]>`
            UPDATE ${"users"}
            SET ${"balance"} = ${db.param(updatedData.balance)}
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
        if (updatedData.creatures!=null) {
            updatedUsers = await db.sql<s.users.SQL, s.users.Selectable[]>`
            UPDATE ${"users"}
            SET ${"creatures"} = ${db.param(updatedData.creatures)}
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

export const buyCreature = async (
  request: FastifyRequest<{ Params: { userId: number; creatureId: number } }>,
  reply: FastifyReply
) => {
  const userId = request.params.userId;
  const creatureId = request.params.creatureId;

  try {
    // Récupérer l'utilisateur et la créature
    const user = await db.sql<s.users.SQL, s.users.Selectable[]>`
      SELECT * FROM ${'users'}
      WHERE ${'id'} = ${db.param(userId)}
    `.run(pool);

    const creature = await db.sql<s.creatures.SQL, s.creatures.Selectable[]>`
      SELECT * FROM ${'creatures'}
      WHERE ${'id'} = ${db.param(creatureId)}
    `.run(pool);

    // Vérifier si l'utilisateur et la créature existent
    if (user.length === 0) {
      reply.code(404).send({ error: 'Utilisateur introuvable' });
      return;
    }
    if (creature.length === 0) {
      reply.code(404).send({ error: 'créature introuvable' });
      return;
    }

    const userRecord = user[0];
    const creatureRecord = creature[0];

    // Vérifier si l'utilisateur a un solde suffisant pour acheter la créature
    if (userRecord.balance < creatureRecord.price) {
      reply.code(400).send({ error: 'Solde insuffisant pour acheter la créature' });
      return;
    }

    // Déduire le prix de la créature du solde de l'utilisateur
    const updatedUser = await db.sql<s.users.SQL, s.users.Selectable[]>`
      UPDATE ${'users'}
      SET ${'balance'} = ${db.param(userRecord.balance - creatureRecord.price)}
      WHERE ${'id'} = ${db.param(userId)}
      RETURNING *;
    `.run(pool);

    // Ajouter la créature à l'inventaire de l'utilisateur
      if (userRecord.creatures != null) {
    await db.sql<s.users.SQL, s.users.Selectable[]>`
      UPDATE ${'users'}
      SET ${'creatures'} = ${db.param(userRecord.creatures + ',' + creatureRecord.id)}
      WHERE ${'id'} = ${db.param(userId)}
      RETURNING *;
    `.run(pool); }
      else {
          await db.sql<s.users.SQL, s.users.Selectable[]>`
      UPDATE ${'users'}
      SET ${'creatures'} = ${db.param(creatureRecord.id)}
      WHERE ${'id'} = ${db.param(userId)}
      RETURNING *;
    `.run(pool);
      }


    reply.send({ data: { user: updatedUser[0], creature: creatureRecord } });
  } catch (error) {
    console.error(error);
    reply.code(500).send({ error: 'Erreur interne du serveur' });
  }
};

export const getCreatures = async (
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
      const userRecord = user[0];

      if (userRecord.creatures) {
        // Remove curly braces and quotes from the string
        const creatureIdsString = userRecord.creatures.replace(/[{}"]/g, '');
        const creatureIds = creatureIdsString.split(',');

        const creatures = await db.sql<s.creatures.SQL, s.creatures.Selectable[]>`
          SELECT * FROM ${'creatures'}
          WHERE id = ANY(${db.param(creatureIds)})
        `.run(pool);

        reply.send({ data: creatures });
      } else {
        reply.send({ data: [] });
      }
    }
  } catch (error) {
    console.error(error);
    reply.code(500).send({ error: 'Internal Server Error' });
  }
};