import { Router, validator } from 'camesine';
import * as express from 'express';
import { AvisoGeralController } from '../controllers/AvisoGeral.controller';

export class AvisoGeralRouter extends Router {
  constructor() {
    super(AvisoGeralController);
    this.router = express.Router()
                         .get('/', this.handler(AvisoGeralController.prototype.all))
    ;
  }
}
