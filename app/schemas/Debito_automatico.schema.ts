import { number, object, string } from 'joi';

export const debitoAutomaticoSchema = {
  create: object().keys({
    dia: number().required(),
    valor: number().required(),
    idCategoria: number().required(),
    idModoDePagamento: number().required(),
  }),
};
