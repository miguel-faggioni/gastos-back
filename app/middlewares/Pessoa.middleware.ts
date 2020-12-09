import * as express from 'express';
import { In } from 'typeorm';
import { log } from '../../config/Logger';
import { AuthService } from '../services/Auth.service';
import { PessoaService } from '../services/Pessoa.service';

export async function CheckPessoas(req: express.Request, res: express.Response, next: express.NextFunction) {
  const { idPessoas } = req.body as { idPessoas: number[] };
  if ( idPessoas === undefined ) {
    req.body.pessoas = null;
    return next();
  }
  const pessoas = await PessoaService.findManyBy({id: In(idPessoas)});
  if ( pessoas && pessoas.length === idPessoas.length ) {
    req.body.pessoas = pessoas;
    next();
  } else {
    log.warn('CheckPessoas failed');
    res.status(403).send(`Pessoa(s) não encontrada(s) [id(s)=${idPessoas}]`);
  }
}

export async function CheckUpdate(req: express.Request, res: express.Response, next: express.NextFunction) {
  const token = await AuthService.extractToken(req) as { id: number };
  if ( token.id === req.body.id ) {
    next();
  } else {
    log.warn('CheckUpdate failed');
    res.status(403).send(`Usuário logado difere do id recebido`);
  }
}

export async function CheckDelete(req: express.Request, res: express.Response, next: express.NextFunction) {
  const token = await AuthService.extractToken(req) as { id: number };
  if ( token.id === req.body.id ) {
    next();
  } else {
    log.warn('CheckDelete failed');
    res.status(403).send(`Usuário logado difere do id recebido`);
  }
}
