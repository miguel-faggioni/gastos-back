import * as express from 'express';
import { log } from '../../config/Logger';
import { AuthService } from '../services/Auth.service';
import { CategoriaService } from '../services/Categoria.service';

export async function CheckDelete(req: express.Request, res: express.Response, next: express.NextFunction) {
  const idCategoria = req.params.id;
  const token = await AuthService.extractToken(req) as { id: number };

  let categoria;
  try {
    categoria = await CategoriaService.findOneBy({
      id: idCategoria,
      pessoa: { id: token.id },
    });
  } catch (ex) {
    log.error(ex);
    return res.status(500).send();
  }

  if ( !categoria ) {
    log.warn('CheckDelete failed');
    return res.status(404).send(`Categoria não encontrada [id=${idCategoria}]`);
  }

  res.locals.categoria = categoria;
  next();

}
