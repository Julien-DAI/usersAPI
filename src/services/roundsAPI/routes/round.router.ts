import { FastifyInstance } from 'fastify'
import * as controllers from '../controllers'

async function roundRouter(fastify: FastifyInstance) {

    fastify.route({
        method: 'GET',
        url: '/rounds',
        handler: controllers.listRounds,
    });

    fastify.route({
        method: 'POST',
        url: '/rounds',
        handler: controllers.addRound,
    });
    fastify.route({
        method: 'PUT',
        url: '/:id',
        handler: controllers.updateRound,
    });
}

export default roundRouter