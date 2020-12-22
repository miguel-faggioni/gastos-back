import { Router, validator } from 'camesine';
import * as express from 'express';

import { CheckParamsId, CheckCreate } from '../middlewares/Gasto.middleware';
import { GastoController } from '../controllers/Gasto.controller';
import { gastoSchema } from '../schemas/Gasto.schema';

export class GastoRouter extends Router {
  constructor() {
    super(GastoController);
    this.router = express
      .Router()
      .get('/', this.handler(GastoController.prototype.all))
      .get('/:id', [
        CheckParamsId,
      ], this.handler(GastoController.prototype.find))
      .delete('/:id', [
        CheckParamsId,
      ], this.handler(GastoController.prototype.remove))
      .delete('/', this.handler(GastoController.prototype.removeAll))
      .post('/', [
        validator(gastoSchema.create),
        CheckCreate,
      ], this.handler(GastoController.prototype.create))
      .put('/:id', [
        validator(gastoSchema.update),
        CheckParamsId,
        CheckCreate,
      ], this.handler(GastoController.prototype.update))
    ;
  }
}
