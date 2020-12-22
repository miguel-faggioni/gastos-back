import { number, object, string, date } from 'joi';

export const gastoSchema = {
  create: object().keys({
    valor: number().required(),
    idCategoria: number().required(),
    idModoDePagamento: number().required(),
    data: date().iso().required(),
  }),
  update: object().keys({
    valor: number(),
    idCategoria: number(),
    idModoDePagamento: number(),
    data: date().iso(),
  }),
};
