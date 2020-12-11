import { Router, validator } from 'camesine';
import * as express from 'express';

import { CheckDelete, CheckCreate } from '../middlewares/Debito_automatico.middleware';
import { DebitoAutomaticoController } from '../controllers/Debito_automatico.controller';
import { debitoAutomaticoSchema } from '../schemas/Debito_automatico.schema';

export class DebitoAutomaticoRouter extends Router {
  constructor() {
    super(DebitoAutomaticoController);
    this.router = express
      .Router()
      .get('/', this.handler(DebitoAutomaticoController.prototype.all))
      .delete('/:id', [
        CheckDelete,
      ], this.handler(DebitoAutomaticoController.prototype.remove))
      .post('/', [
        validator(debitoAutomaticoSchema.create),
        CheckCreate,
      ], this.handler(DebitoAutomaticoController.prototype.create))
    ;
  }
}
