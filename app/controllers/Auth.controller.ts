import { Controller } from 'camesine';
import * as express from 'express';
import { log } from '../../config/Logger';

import { Feedback } from '../models/Feedback.model';
import { Pessoa } from '../models/Pessoa.model';
import { Usuario } from '../models/Usuario.model';

import { AuthService } from '../services/Auth.service';
import { FeedbackService } from '../services/Feedback.service';
import { PessoaService } from '../services/Pessoa.service';
import { UsuarioService } from '../services/Usuario.service';

import * as hash from 'hash.js';

export class AuthController extends Controller {

  constructor(req: express.Request, res: express.Response) {
    super(req, res);
  }

  public async login(): Promise<express.Response> {
    const { email, senha } = this.req.body as { email: string, senha: string };
    const user = await Usuario.createQueryBuilder('u')
                              .where('u.email = :email AND u.senha = :senha', {email, senha: hash.sha512().update(senha).digest('hex') })
                              .getOne();
    if (user) {
      try {
        const pessoa = await PessoaService.findOneByUserId(user.id);
        const token = await AuthService.signToken(pessoa.id);
        return this.res.status(200).send({token});
      } catch (ex) {
        log.error(ex);
        return this.res.status(500).send(`Erro no servidor ao tentar salvar usuário`);
      }
    } else {
      return this.res.status(401).send();
    }
  }

  public async testToken(): Promise<express.Response> {
    try {
      const { token } = this.req.body as { token: string };
      const valid = await AuthService.validateToken(token);
      if (valid) {
        return this.res.status(200).send(true);
      } else {
        return this.res.status(200).send(false);
      }
    } catch (ex) {
      log.error(ex);
      return this.res.status(500).send(`Erro no servidor ao tentar validar token`);
    }
  }

  public async receiveFeedback(): Promise<express.Response> {
    const { text } = this.req.body;
    const f = new Feedback();
    f.texto = text;
    try {
      await FeedbackService.save(f);
    } catch (ex) {
      log.error(ex);
      return this.res.status(500).send(`Erro no servidor ao tentar salvar feedback (agora fodeu)`);
    }
    return this.res.status(200).send();
  }

  public async create(): Promise<express.Response> {
    const { nome, email, senha } = this.req.body as { nome: string, email: string, senha: string };
    // busca email
    let u;
    try {
      u = await UsuarioService.findOneBy({email});
    } catch (ex) {
      log.error(ex);
      return this.res.status(500).send(`Erro no servidor ao tentar buscar usuário [email=${email}]`);
    }
    if (u) { return this.res.status(403).send(`Email já está em uso [email=${email}]`); }
    const pessoa = new Pessoa();
    const user = new Usuario();
    user.email = email;
    user.senha = hash.sha512().update(senha).digest('hex');
    pessoa.usuario = user;
    pessoa.nome = nome;
    let result;
    try {
      await UsuarioService.save(user);
      result = await PessoaService.save(pessoa);
    } catch (ex) {
      log.error(ex);
      return this.res.status(500).send(`Erro no servidor ao tentar salvar usuário`);
    }

    return this.res.status(200).send(result);
  }

}
