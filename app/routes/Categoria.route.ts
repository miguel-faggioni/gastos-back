import { Router, validator } from 'camesine';
import * as express from 'express';

import { CheckParamsId } from '../middlewares/Categoria.middleware';
import { CategoriaController } from '../controllers/Categoria.controller';
import { categoriaSchema } from '../schemas/Categoria.schema';

export class CategoriaRouter extends Router {
  constructor() {
    super(CategoriaController);
    this.router = express
      .Router()
      .get('/', this.handler(CategoriaController.prototype.all))
      .delete('/:id', [
        CheckParamsId,
      ], this.handler(CategoriaController.prototype.remove))
      .post('/', [
        validator(categoriaSchema.create),
      ], this.handler(CategoriaController.prototype.create))
      .put('/:id', [
        CheckParamsId,
        validator(categoriaSchema.update),
      ], this.handler(CategoriaController.prototype.update))
    ;
  }
}
