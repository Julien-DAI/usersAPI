import { FastifyInstance } from 'fastify'
import * as controllers from '../controllers'

async function matchRouter(fastify: FastifyInstance) {

    fastify.route({
        method: 'GET',
        url: '/matchs',
        handler: controllers.listMatchs,
    });

    fastify.route({
        method: 'POST',
        url: '/matchs',
        handler: controllers.addMatch,
    });
    fastify.route({
        method: 'PUT',
        url: '/:id',
        handler: controllers.updateMatch,
    });
}

export default matchRouter