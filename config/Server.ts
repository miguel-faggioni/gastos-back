import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as formidable from 'express-formidable';
import * as fs from 'fs';
import * as https from 'https';
import * as methodOverride from 'method-override';
import * as morgan from 'morgan';
import { env } from 'process';
import { PessoaService } from '../app/services/Pessoa.service';
import { config } from '../config';
import { Connection } from './Database';
import { ROUTER } from './Router';

// configurações do Sentry
import * as Sentry from '@sentry/node';
Sentry.init({
  dsn: 'https://af8b10f819874e9ca3f7f8044bcbf3bc@sentry.io/1498947',
  level: 'warn',
  release: 'backend@' + config.VERSION,
  environment: ( config.SERVERNAME === 'localhost' ? 'development' : 'production' ),
});
import { AuthService } from '../app/services/Auth.service';

export class Server {

  constructor() {
    this.app = express();
    this.server = https.createServer({
      key: fs.readFileSync('./ssl/' + config.SERVERNAME + '/privkey.pem', 'utf-8'),
      cert: fs.readFileSync('./ssl/' + config.SERVERNAME + '/fullchain.pem', 'utf-8'),
    }, this.app);
  }

  private readonly app: express.Application;
  private readonly server: https.Server;
  private static ConnectDB(): Promise<any> {
    return Connection;
  }

  public Start(): Promise<https.Server> {
    return Server.ConnectDB().then(() => {
      this.ExpressConfiguration();
      this.ConfigurationRouter();
      return this.server;
    });
  }

  public App(): express.Application {
    return this.app;
  }

  private ExpressConfiguration(): void {
    if ( config.SERVERNAME !== 'localhost' ) {
      this.app.use(Sentry.Handlers.requestHandler() as express.RequestHandler);
    }

    const uploadDir = __dirname + ( env.NODE_ENV === 'PRODUCTION' ? '/../..' : '/..' ) + '/uploaded';
    this.app.use('/arquivo/', formidable({
      uploadDir,
    }));

    this.app.use(express.static(uploadDir));
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json({ limit: '50mb' }));
    this.app.use(methodOverride());
    this.app.use((req, res, next): void => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE,OPTIONS');
      next();
    });
    this.app.use(morgan('combined'));
    this.app.use(cors());
    if ( config.SERVERNAME !== 'localhost' ) {
      this.app.use(Sentry.Handlers.errorHandler() as express.ErrorRequestHandler);
    }
    this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction): void => {
      err.status = 404;
      next(err);
    });
  }

  private ConfigurationRouter(): void {
    // extrai jwt da request
    this.app.use(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      req.app.set('auth', {
        user: null,
        jwt: { id: '__usuário não autenticado__' },
      });
      try {
        // TODO validar token
        const jwt = await AuthService.extractToken(req);
        if (jwt) {
          const user = await PessoaService.findOneBy({id: jwt.id});
          req.app.set('auth', {
            user,
            jwt,
          });
        }
        Sentry.configureScope((scope) => {
          scope.setUser({
            id: jwt.id,
          });
          scope.setTag('transaction_id', jwt);
        });
      } catch (ex) {
        // requisição sem token válido
      }
      next();
    });

    for (const route of ROUTER) {
      this.app.use(route.path, route.middleware, route.handler);
    }
    this.app.use((req: express.Request, res: express.Response, next: express.NextFunction): void => {
      res.status(404);
      res.json({
        error: 'Not found',
      });
      next();
    });
    this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction): void => {
      if (err.name === 'UnauthorizedError') {
        res.status(401).json({
          error: 'Please send a valid Token...',
        });
      }
      next();
    });
    this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction): void => {
      if (err.name === 'clientError') {
        res.status(401).json({
          error: 'Request error',
        });
      }
      next();
    });
    this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction): void => {
      res.status(err.status || 500);
      res.json({
        error: err.message,
      });
      next();
    });
  }

}
