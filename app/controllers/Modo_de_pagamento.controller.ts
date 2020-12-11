import { Controller } from 'camesine';
import * as express from 'express';
import { log } from '../../config/Logger';
import { ModoDePagamento } from '../models/Modo_de_pagamento.model';
import { ModoDePagamentoService } from '../services/Modo_de_pagamento.service';
import { AuthService } from '../services/Auth.service';
import { PessoaService } from '../services/Pessoa.service';
import { GastoService } from '../services/Gasto.service';
import { DebitoAutomaticoService } from '../services/Debito_automatico.service';

export class ModoDePagamentoController extends Controller {

  constructor(req: express.Request, res: express.Response) {
    super(req, res);
  }

  public async all(): Promise<express.Response> {
    let token, list;
    try {
      token = await AuthService.extractToken(this.req) as { id: number };
      list = await ModoDePagamentoService.findManyBy({
        pessoa: {id: token.id},
      });
    } catch (ex) {
      log.error(ex);
      return this.res.status(500).send();
    }
    return this.res.status(200).send(list);
  }

  public async remove(): Promise<express.Response> {
    const { substituirPor } = this.req.body as { substituirPor: number };
    const modoDePagamento = this.res.locals.modoDePagamento;

    if ( substituirPor !== undefined ) {

      let token;
      try {
        token = await AuthService.extractToken(this.req) as { id: number };
      } catch (ex) {
        log.error(ex);
        return this.res.status(500).send();
      }

      try {
        await GastoService.update({
          modo_de_pagamento: modoDePagamento,
          pessoa: {id: token.id},
        }, {
          modo_de_pagamento: { id: substituirPor }
        });
        await DebitoAutomaticoService.update({
          modo_de_pagamento: modoDePagamento,
          pessoa: {id: token.id},
        }, {
          modo_de_pagamento: { id: substituirPor }
        });
      } catch (ex) {
        log.error(ex);
        return this.res.status(500).send();
      }

    }

    try {
      await ModoDePagamentoService.remove(modoDePagamento);
    } catch (ex) {
      log.error(ex);
      return this.res.status(500).send();
    }

    return this.res.status(204).send();
  }

  public async create(): Promise<express.Response> {
    const { nome, sigla, icone } = this.req.body as { nome: string, sigla: string, icone: string };

    let token, pessoa;
    try {
      token = await AuthService.extractToken(this.req) as { id: number };
      pessoa = await PessoaService.findOneBy({
        id: token.id,
      });
    } catch (ex) {
      log.error(ex);
      return this.res.status(500).send();
    }

    const modoDePagamento = new ModoDePagamento();
    modoDePagamento.nome = nome;
    modoDePagamento.sigla = sigla;
    modoDePagamento.icone = icone;
    modoDePagamento.pessoa = pessoa;

    try {
      await ModoDePagamentoService.save(modoDePagamento);
    } catch (ex) {
      log.error(ex);
      return this.res.status(500).send();
    }

    return this.res.status(201).send();
  }

}
