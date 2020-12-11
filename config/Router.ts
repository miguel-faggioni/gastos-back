import * as express from 'express';
import * as jwt from 'express-jwt';
import { config } from '../config';

import { AuthRouter } from '../app/routes/Auth.route';
import { HealthRouter } from '../app/routes/Health.route';
import { AvisoGeralRouter } from '../app/routes/AvisoGeral.route';
import { CategoriaRouter } from '../app/routes/Categoria.route';

interface IROUTER {
  path: string;
  middleware: any[];
  handler: express.Router;
}

const Health = new HealthRouter();
const Auth = new AuthRouter();
const AvisoGeral = new AvisoGeralRouter();
const Categoria = new CategoriaRouter();

export const ROUTER: IROUTER[] = [{
  handler: AvisoGeral.router,
  middleware: [
    jwt({secret: config.SECRET}),
  ],
  path: '/aviso-geral',
}, {
  handler: Health.router,
  middleware: [],
  path: '/health',
}, {
  handler: Auth.router,
  middleware: [],
  path: '/auth',
}, {
  handler: Categoria.router,
  middleware: [
    jwt({secret: config.SECRET}),
  ],
  path: '/categorias',
}];
