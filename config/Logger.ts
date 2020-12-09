import { env } from 'process';
import { Logger, QueryRunner } from 'typeorm';
import * as winston from 'winston';
import { config } from '../config';

// 'silly' | 'debug' | 'verbose' | 'info' | 'warn' | 'error'
const DB_LOG_LEVEL = 'warn';
const LOG_LEVEL = 'debug';

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    return Object.assign({
      message: info.message,
      stack: info.stack,
    }, info);
  }
  return info;
});

// --------------------------------------------------
//   Logger para as queries do TypeORM
// --------------------------------------------------

export class WinstonLogger implements Logger {

  public logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: DB_LOG_LEVEL,
      format: winston.format.combine(
        enumerateErrorFormat(),
        winston.format.json(),
      ),
      defaultMeta: { service: 'typeorm-query' },
      transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log`
        // - Write all logs error (and below) to `error.log`.
        //
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/query.log' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
      ],
    });

    //
    // If we're not in production then log to the `console` with the format:
    // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
    //
    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(new winston.transports.Console({
        // format: winston.format.simple()
        format: winston.format.combine(
          winston.format.align(),
          winston.format.colorize({ all: true }),
          winston.format.timestamp(),
          winston.format.printf(({ level, message, label, timestamp }) => {
            return `${timestamp} [${level}] ${message}`;
          }),
        ),
      }));
    }
  }

  public getLogger(): winston.Logger {
    return this.logger;
  }
  public logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    this.logger.log({
      level: 'info',
      message: query,
      parameters,
    });
  }

  public logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    this.logger.log({
      level: 'error',
      message: query,
      parameters,
    });
  }

  public logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    this.logger.log({
      level: 'warn',
      message: query,
      parameters,
      time,
      what: 'slow-query',
    });
  }

  public logSchemaBuild(message: string, queryRunner?: QueryRunner): any {
    this.logger.log({
      level: 'info',
      message,
      what: 'schema-build',
    });
  }

  public logMigration(message: string, queryRunner?: QueryRunner): any {
    this.logger.log({
      level: 'info',
      message,
      what: 'migration',
    });
  }

  public log(level: 'log' | 'info' | 'warn' , message: any, queryRunner?: QueryRunner): any {
    switch (level) {
      case 'log':
        this.logger.debug(message);
        break;
      case 'info':
        this.logger.info(message);
        break;
      case 'warn':
        this.logger.warn(message);
        break;
      default:
        this.logger.verbose(message);
        break;
    }
  }

}

// --------------------------------------------------
//   Logger para uso genérico
// --------------------------------------------------

export let log = winston.createLogger({
  level: LOG_LEVEL,
  format: winston.format.combine(
    enumerateErrorFormat(),
    winston.format.json(),
  ),
  defaultMeta: { service: 'console' },
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs to console
    //
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.File({ filename: 'logs/console.log' }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.printf((info) => {
          if ( typeof info.message === 'object' ) {
            info.message = JSON.stringify(info.message);
          }
          return info.message;
        }),
        winston.format.splat(),
        winston.format.align(),
        winston.format.colorize({ all: true }),
        winston.format.timestamp(),
        winston.format.printf(({ level, message, label, timestamp }) => {
          return `${timestamp} [${level}] ${message}`;
        }),
      ),
    }),
  ],
});
