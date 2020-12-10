import { EntityRepository, Repository } from 'typeorm';
import { ModoDePagamento } from '../models/Modo_de_pagamento.model';

@EntityRepository(ModoDePagamento)
export class ModoDePagamentoRepository extends Repository<ModoDePagamento> {

}
