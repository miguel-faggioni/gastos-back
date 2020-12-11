import * as express from 'express';
import { log } from '../../config/Logger';
import { AuthService } from '../services/Auth.service';
import { DebitoAutomaticoService } from '../services/Debito_automatico.service';
import { CategoriaService } from '../services/Categoria.service';
import { ModoDePagamentoService } from '../services/Modo_de_pagamento.service';

export async function CheckDelete(req: express.Request, res: express.Response, next: express.NextFunction) {
  const idDebitoAutomatico = req.params.id;
  const token = await AuthService.extractToken(req) as { id: number };

  let debitoAutomatico;
  try {
    debitoAutomatico = await DebitoAutomaticoService.findOneBy({
      id: idDebitoAutomatico,
      pessoa: { id: token.id },
    });
  } catch (ex) {
    log.error(ex);
    return res.status(500).send();
  }

  if ( !debitoAutomatico ) {
    log.warn('CheckDelete failed');
    return res.status(404).send(`DebitoAutomatico não encontrado [id=${idDebitoAutomatico}]`);
  }

  res.locals.debitoAutomatico = debitoAutomatico;
  next();

}

export async function CheckCreate(req: express.Request, res: express.Response, next: express.NextFunction) {
  const { idCategoria, idModoDePagamento } = req.body as { idCategoria: number, idModoDePagamento: number };
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
    log.warn('CheckCreate failed');
    return res.status(404).send(`Categoria não encontrada [id=${idCategoria}]`);
  }

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

  res.locals.categoria = categoria;
  res.locals.modo_de_pagamento = modoDePagamento;
  next();

}
