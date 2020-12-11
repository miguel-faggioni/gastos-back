import * as express from 'express';
import { log } from '../../config/Logger';
import { AuthService } from '../services/Auth.service';
import { ModoDePagamentoService } from '../services/Modo_de_pagamento.service';

export async function CheckDelete(req: express.Request, res: express.Response, next: express.NextFunction) {
  const idModoDePagamento = req.params.id;
  const token = await AuthService.extractToken(req) as { id: number };

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
    log.warn('CheckDelete failed');
    return res.status(404).send(`ModoDePagamento não encontrado [id=${idModoDePagamento}]`);
  }

  res.locals.modoDePagamento = modoDePagamento;
  next();

}
