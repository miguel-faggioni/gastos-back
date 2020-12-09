import { createConnection, Logger } from 'typeorm';
import { config, DIALECT } from '../config';
import { WinstonLogger } from './Logger';

export const Connection = createConnection({
  database: config.DATABASE.DB,
  entities: [
    'app/models/*.js',
    'app/models/*.ts',
  ],
  host: config.DATABASE.SERVER,
  logger: new WinstonLogger() as Logger,
  password: config.DATABASE.PASSWORD,
  port: config.DATABASE.PORT_DB,
  synchronize: false,
  type: DIALECT,
  username: config.DATABASE.USER_DB,
});
