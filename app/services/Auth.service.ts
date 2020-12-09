import * as express from 'express';
import * as Auth from 'jsonwebtoken';
import * as bearer from 'token-extractor';
import { config } from '../../config';
import { Pessoa } from '../models/Pessoa.model';

export class AuthService {

  public static signToken(pessoaId: number, options?: any): string {
    const auth = { id: pessoaId };
    return Auth.sign(auth, config.SECRET, options || undefined);
  }

  public static extractToken(req: express.Request): Promise<any> {
    return new Promise((resolve, reject) => {
      bearer(req, (err: Error, token: string) => {
        if (err) {
          reject(err);
        }
        resolve(Auth.decode(token));
      });
    });
  }

  public static validateToken(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(Auth.decode(token));
    });
  }
}
