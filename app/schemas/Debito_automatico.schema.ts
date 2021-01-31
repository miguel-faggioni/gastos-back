import { number, object, string } from 'joi';

import { TipoGasto } from '../models/Gasto.model';

export const debitoAutomaticoSchema = {
  create: object().keys({
    dia: number().required(),
    valor: number().required(),
    idCategoria: number().required(),
    idModoDePagamento: number().required(),
    tipo: string().valid(...Object.values(TipoGasto)),
    obs: string(),
  }),
  update: object().keys({
    dia: number(),
    valor: number(),
    idCategoria: number(),
    idModoDePagamento: number(),
    tipo: string().valid(...Object.values(TipoGasto)),
    obs: string(),
  }),
};
