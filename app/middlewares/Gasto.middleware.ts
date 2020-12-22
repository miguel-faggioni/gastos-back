import * as express from 'express';
import { log } from '../../config/Logger';
import { AuthService } from '../services/Auth.service';
import { GastoService } from '../services/Gasto.service';
import { CategoriaService } from '../services/Categoria.service';
import { ModoDePagamentoService } from '../services/Modo_de_pagamento.service';

export async function CheckParamsId(req: express.Request, res: express.Response, next: express.NextFunction) {
  const idGasto = req.params.id;
  const token = await AuthService.extractToken(req) as { id: number };

  let gasto;
  try {
    gasto = await GastoService.findOneBy({
      id: idGasto,
      pessoa: { id: token.id },
    });
  } catch (ex) {
    log.error(ex);
    return res.status(500).send();
  }

  if ( !gasto ) {
    log.warn('CheckParamsId failed');
    return res.status(404).send(`Gasto não encontrado [id=${idGasto}]`);
  }

  res.locals.gasto = gasto;
  next();

}

export async function CheckCreate(req: express.Request, res: express.Response, next: express.NextFunction) {
  const { idCategoria, idModoDePagamento } = req.body as { idCategoria: number, idModoDePagamento: number };
  const token = await AuthService.extractToken(req) as { id: number };

  if ( idCategoria !== undefined ) {
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
      log.warn('CheckCreate failed');
      return res.status(404).send(`Categoria não encontrada [id=${idCategoria}]`);
    }

    res.locals.categoria = categoria;
  }

  if ( idModoDePagamento !== undefined ) {
    let modoDePagamento;
    try {
      modoDePagamento = await ModoDePagamentoService.findOneBy({
        id: idModoDePagamento,
        pessoa: { id: token.id },
      });
    } catch (ex) {
      log.error(ex);
      return res.status(500).send();
    }

    if ( !modoDePagamento ) {
      log.warn('CheckCreate failed');
      return res.status(404).send(`ModoDePagamento não encontrado [id=${idModoDePagamento}]`);
    }

    res.locals.modo_de_pagamento = modoDePagamento;
  }

  next();

}
