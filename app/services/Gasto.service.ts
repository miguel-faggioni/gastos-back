import { getCustomRepository, Repository } from 'typeorm';
import { Gasto } from '../models/Gasto.model';
import { GastoRepository } from '../repository/Gasto.repository';

export class GastoService {

  public static findOneBy(whereClause: any, options?: any): Promise<Gasto> {
    const opts = Object.assign({}, options, { where: whereClause });
    return getCustomRepository(GastoRepository).findOne(opts);
  }

  public static findManyBy(whereClause: any, options?: any): Promise<Gasto[]> {
    const opts = Object.assign({}, options, { where: whereClause });
    return getCustomRepository(GastoRepository).find(opts);
  }

  public static bulkCreate(Gastos: Gasto[]): Promise<Gasto[]> {
    return getCustomRepository(GastoRepository).bulkCreate(Gastos);
  }

  public static remove(gasto: Gasto): Promise<Gasto> {
    return getCustomRepository(GastoRepository).remove(gasto);
  }

  public static removeById(id: number): Promise<Gasto> {
    return getCustomRepository(GastoRepository).removeById(id);
  }

  public static save(gasto: Gasto): Promise<Gasto> {
    return getCustomRepository(GastoRepository).save(gasto);
  }

}
