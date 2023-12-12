import { FastifyInstance } from 'fastify'
import * as controllers from '../controllers'

async function creaturesRouter(fastify: FastifyInstance) {
    fastify.route({
        method: 'GET',
        url: '/creatures',
        handler: controllers.listCreatures,
    });

    fastify.route({
        method: 'POST',
        url: '/creatures',
        handler: controllers.addCreature,
    });

}

export default creaturesRouter