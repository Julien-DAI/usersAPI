import fastify from 'fastify'
import creaturesRouter from './routes/creatures.router'
import 'dotenv/config'
import {initDB} from "../../common/db/initDB";

const port = 5004;

const startServer = async () => {
    try {
        const server = fastify()

        const errorHandler = (error, address) => {
            server.log.error(error, address);
        }



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