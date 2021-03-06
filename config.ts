import { SERVERNAME, DATABASE_CONFIGURATION } from './database';

export const DIALECT = 'postgres';

export const config = {
  VERSION: require('./package.json').version,
  SERVERNAME: SERVERNAME,
  DATABASE: DATABASE_CONFIGURATION,
  PORT_APP: 5001,
  SECRET: DATABASE_CONFIGURATION.SECRET,
  SENTRY: '',
};
