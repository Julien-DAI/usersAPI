import fastify from 'fastify'
import 'dotenv/config'
import {initDB} from "../../common/db/initDB";
import roundRouter from "./routes/round.router";

const port = 5002;

const startServer = async () => {
    try {
        const server = fastify()

        const errorHandler = (error, address) => {
            server.log.error(error, address);
        }
        server.register(roundRouter, { prefix: '/api/round' })

        await server.listen({ port }, errorHandler)
    } catch (e) {
        console.error(e)
    }
}

process.on('unhandledRejection', (e) => {
    console.error(e)
    process.exit(1)
})

//initDB();
startServer();