const config = require('./config.ts');

const local = require('./database.local.ts');
const aws = require('./database.aws.ts');

module.exports = [{
  "name": "dev",
  "type": config.DIALECT,
  "host": local.DATABASE_CONFIGURATION.SERVER,
  "port": local.DATABASE_CONFIGURATION.PORT_DB,
  "username": local.DATABASE_CONFIGURATION.USER_DB,
  "password": local.DATABASE_CONFIGURATION.PASSWORD,
  "database": local.DATABASE_CONFIGURATION.DB,
  "entities": ["app/models/*.ts"],
  "migrations": ["migration/dev/*.ts"],
  "cli": {
    "migrationsDir": "migration/dev"
  }
},{
  "name": "prod",
  "type": config.DIALECT,
  "host": aws.DATABASE_CONFIGURATION.SERVER,
  "port": aws.DATABASE_CONFIGURATION.PORT_DB,
  "username": aws.DATABASE_CONFIGURATION.USER_DB,
  "password": aws.DATABASE_CONFIGURATION.PASSWORD,
  "database": aws.DATABASE_CONFIGURATION.DB,
  "entities": ["app/models/*.ts"],
  "migrations": ["migration/prod/*.ts"],
  "cli": {
    "migrationsDir": "migration/prod"
  }
}];
