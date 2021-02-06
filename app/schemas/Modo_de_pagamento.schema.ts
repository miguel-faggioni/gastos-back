import { number, object, string } from 'joi';

export const modoDePagamentoSchema = {
  create: object().keys({
    nome: string().required(),
    sigla: string().required(),
    icone: string().required(),
  }),
  update: object().keys({
    nome: string(),
    sigla: string(),
    icone: string(),
  }),
  remove: object().keys({
    substituirPor: number(),
  }),
};
