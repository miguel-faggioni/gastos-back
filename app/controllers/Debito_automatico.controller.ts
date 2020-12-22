import { Controller } from 'camesine';
import * as express from 'express';
import { log } from '../../config/Logger';
import { DebitoAutomatico } from '../models/Debito_automatico.model';
import { DebitoAutomaticoService } from '../services/Debito_automatico.service';
import { AuthService } from '../services/Auth.service';
import { PessoaService } from '../services/Pessoa.service';
import { Categoria } from '../models/Categoria.model';
import { ModoDePagamento } from '../models/Modo_de_pagamento.model';

export class DebitoAutomaticoController extends Controller {

  constructor(req: express.Request, res: express.Response) {
    super(req, res);
  }

  public async all(): Promise<express.Response> {
    let token, list;
    try {
      token = await AuthService.extractToken(this.req) as { id: number };
      list = await DebitoAutomaticoService.findManyBy({
        pessoa: {id: token.id},
      }, {
        relations: ['categoria', 'modo_de_pagamento'],
      });
    } catch (ex) {
      log.error(ex);
      return this.res.status(500).send();
    }
    return this.res.status(200).send(list);
  }

  public async remove(): Promise<express.Response> {
    const debitoAutomatico = this.res.locals.debitoAutomatico;

    try {
      await DebitoAutomaticoService.remove(debitoAutomatico);
    } catch (ex) {
      log.error(ex);
      return this.res.status(500).send();
    }

    return this.res.status(204).send();
  }

  public async create(): Promise<express.Response> {
    const { dia, valor } = this.req.body as { dia: number, valor: number };
    const { categoria, modo_de_pagamento } = this.res.locals as { categoria: Categoria, modo_de_pagamento: ModoDePagamento };

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

    const debitoAutomatico = new DebitoAutomatico();
    debitoAutomatico.dia_do_mes = dia;
    debitoAutomatico.valor = valor;
    debitoAutomatico.categoria = categoria;
    debitoAutomatico.modo_de_pagamento = modo_de_pagamento;
    debitoAutomatico.pessoa = pessoa;

    try {
      await DebitoAutomaticoService.save(debitoAutomatico);
    } catch (ex) {
      log.error(ex);
      return this.res.status(500).send();
    }

    return this.res.status(201).send();
  }

  public async update(): Promise<express.Response> {
    const { dia, valor } = this.req.body as { dia: number, valor: number };
    const { debitoAutomatico, categoria, modo_de_pagamento } = this.res.locals as { debitoAutomatico: DebitoAutomatico, categoria: Categoria, modo_de_pagamento: ModoDePagamento };

    if ( dia !== undefined ) {debitoAutomatico.dia_do_mes = dia; }
    if (valor !== undefined) {debitoAutomatico.valor = valor; }
    if (categoria !== undefined) {debitoAutomatico.categoria = categoria; }
    if (modo_de_pagamento !== undefined) {debitoAutomatico.modo_de_pagamento = modo_de_pagamento; }

    try {
      await DebitoAutomaticoService.save(debitoAutomatico);
    } catch (ex) {
      log.error(ex);
      return this.res.status(500).send();
    }

    return this.res.status(204).send();
  }

}
