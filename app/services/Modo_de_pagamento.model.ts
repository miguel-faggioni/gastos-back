import { getCustomRepository, Repository } from 'typeorm';
import { ModoDePagamento } from '../models/Modo_de_pagamento.model';
import { ModoDePagamentoRepository } from '../repository/Modo_de_pagamento.repository';

export class ModoDePagamentoService {

  public static findOneBy(whereClause: any, options?: any): Promise<ModoDePagamento> {
    const opts = Object.assign({}, options, { where: whereClause });
    return getCustomRepository(ModoDePagamentoRepository).findOne(opts);
  }

  public static findManyBy(whereClause: any, options?: any): Promise<ModoDePagamento[]> {
    const opts = Object.assign({}, options, { where: whereClause });
    return getCustomRepository(ModoDePagamentoRepository).find(opts);
  }

  public static bulkCreate(ModoDePagamentos: ModoDePagamento[]): Promise<ModoDePagamento[]> {
    return getCustomRepository(ModoDePagamentoRepository).bulkCreate(ModoDePagamentos);
  }

  public static remove(modoDePagamento: ModoDePagamento): Promise<ModoDePagamento> {
    return getCustomRepository(ModoDePagamentoRepository).remove(modoDePagamento);
  }

  public static removeById(id: number): Promise<ModoDePagamento> {
    return getCustomRepository(ModoDePagamentoRepository).removeById(id);
  }

  public static save(modoDePagamento: ModoDePagamento): Promise<ModoDePagamento> {
    return getCustomRepository(ModoDePagamentoRepository).save(modoDePagamento);
  }

}
