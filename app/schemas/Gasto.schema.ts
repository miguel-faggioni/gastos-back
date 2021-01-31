import { number, object, string, date } from 'joi';

import { TipoGasto } from '../models/Gasto.model';

export const gastoSchema = {
  create: object().keys({
    valor: number().required(),
    idCategoria: number().required(),
    idModoDePagamento: number().required(),
    data: date().iso().required(),
    tipo: string().valid(...Object.values(TipoGasto)),
    obs: string(),
  }),
  update: object().keys({
    valor: number(),
    idCategoria: number(),
    idModoDePagamento: number(),
    data: date().iso(),
    tipo: string().valid(...Object.values(TipoGasto)),
    obs: string(),
  }),
};
