import { Controller } from 'camesine';
import * as express from 'express';
import { log } from '../../config/Logger';
import { AvisoGeral } from '../models/AvisoGeral.model';
import { AvisoGeralService } from '../services/AvisoGeral.service';

export class AvisoGeralController extends Controller {

  constructor(req: express.Request, res: express.Response) {
    super(req, res);
  }

  public async all(): Promise<express.Response> {
    const avisoList = await AvisoGeralService.findManyBy({});
    return this.res.send(avisoList);
  }

}
