import { number, object, string } from 'joi';

export const modoDePagamentoSchema = {
  create: object().keys({
    nome: string().required(),
    sigla: string().required(),
    icone: string().required(),
  }),
  remove: object().keys({
    substituirPor: number(),
  }),
};
