import fastify from 'fastify'
import 'dotenv/config'
import matchRouter from "./routes/match.router";
import {initDB} from "../../common/db/initDB";


const port = 5003;

const startServer = async () => {
    try {
        const server = fastify()

        const errorHandler = (error, address) => {
            server.log.error(error, address);
        }
        server.register(matchRouter, { prefix: '/api/match' })
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