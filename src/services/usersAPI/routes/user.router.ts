import { FastifyInstance } from 'fastify'
import * as controllers from '../controllers'

async function userRouter(fastify: FastifyInstance) {

    fastify.route({
        method: 'GET',
        url: '/users',
        handler: controllers.listUsers,
    });

    fastify.route({
        method: 'GET',
        url: '/:id',
        handler: controllers.getUserById,
    });

    fastify.route({
        method: 'GET',
        url: '/creatures/:id',
        handler: controllers.getCreatures,
    });

    fastify.route({
        method: 'POST',
        url: '/users',
        handler: controllers.addUser,
    });

    fastify.route({
        method: 'PUT',
        url: '/:id',
        handler: controllers.updateUser,
    });

    fastify.route({
        method: 'POST',
        url: '/buy/:userId/:creatureId',
        handler: controllers.buyCreature,
    });

}

export default userRouter