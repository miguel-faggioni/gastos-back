import * as cluster from 'cluster';
import { cpus } from 'os';
import { env } from 'process';
import { config } from './config';
import { Server } from './config/Server';

if (cluster.isMaster) {
    console.log(`\n -------------------> RUN ${config.SERVERNAME} ENVIRONMENT [ DB : ${config.DATABASE.SERVER} ]\n`);
    for (const _ of cpus()) {
        cluster.fork();
        if (process.env.NODE_ENV !== 'PRODUCTION') {
            break;
        }
    }
    cluster.on('exit', (worker, code, signal) => {
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starting a new worker');
        cluster.fork();
    });
} else {
    const port: number = Number(env.PORT) || config.PORT_APP || 3000;
    new Server().Start().then((server) => {
        console.log('Number(env.PORT)', Number(env.PORT));
        console.log('config.PORT_APP', config.PORT_APP);
        console.log(port);
        server.listen(port);
        server.on('error', (error: any) => {
            if (error.syscall !== 'listen') {
                throw error;
            }
            switch (error.code) {
                case 'EACCES':
                    console.error('Port requires elevated privileges');
                    process.exit(1);
                    break;
                case 'EADDRINUSE':
                    console.error('Port is already in use');
                    process.exit(1);
                    break;
                default:
                    throw error;
            }
        });
        server.on('listening', () => {
            console.log('Server is running in process ' + process.pid + ' listening on PORT ' + port + '\n');
        });
    });
}
