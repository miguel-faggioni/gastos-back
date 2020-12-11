import { Controller } from 'camesine';
import * as express from 'express';
import { log } from '../../config/Logger';
import { Categoria } from '../models/Categoria.model';
import { CategoriaService } from '../services/Categoria.service';
import { AuthService } from '../services/Auth.service';
import { PessoaService } from '../services/Pessoa.service';

export class CategoriaController extends Controller {

  constructor(req: express.Request, res: express.Response) {
    super(req, res);
  }

  public async all(): Promise<express.Response> {
    let token, list;
    try {
      token = await AuthService.extractToken(this.req) as { id: number };
      list = await CategoriaService.findManyBy({
        pessoa: {id: token.id},
      });
    } catch (ex) {
      log.error(ex);
      return this.res.status(500).send();
    }
    return this.res.status(200).send(list);
  }

  public async remove(): Promise<express.Response> {
    const categoria = this.res.locals.categoria;

    try {
      await CategoriaService.remove(categoria);
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

    const categoria = new Categoria();
    categoria.nome = nome;
    categoria.sigla = sigla;
    categoria.icone = icone;
    categoria.pessoa = pessoa;

    try {
      await CategoriaService.save(categoria);
    } catch (ex) {
      log.error(ex);
      return this.res.status(500).send();
    }

    return this.res.status(201).send();
  }

}