import { number, object, string } from 'joi';

export const categoriaSchema = {
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
};
