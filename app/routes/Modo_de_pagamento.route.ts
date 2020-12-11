import { Router, validator } from 'camesine';
import * as express from 'express';

import { CheckDelete } from '../middlewares/Modo_de_pagamento.middleware';
import { ModoDePagamentoController } from '../controllers/Modo_de_pagamento.controller';
import { modoDePagamentoSchema } from '../schemas/Modo_de_pagamento.schema';

export class ModoDePagamentoRouter extends Router {
  constructor() {
    super(ModoDePagamentoController);
    this.router = express
      .Router()
      .get('/', this.handler(ModoDePagamentoController.prototype.all))
      .delete('/:id', [
        CheckDelete,
        validator(modoDePagamentoSchema.remove),
      ], this.handler(ModoDePagamentoController.prototype.remove))
      .post('/', [
        validator(modoDePagamentoSchema.create),
      ], this.handler(ModoDePagamentoController.prototype.create))
    ;
  }
}
