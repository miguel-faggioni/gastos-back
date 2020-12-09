import { getCustomRepository, Repository } from 'typeorm';
import { AvisoGeral } from '../models/AvisoGeral.model';
import { AvisoGeralRepository } from '../repository/AvisoGeral.repository';

export class AvisoGeralService {

  public static findOneBy(whereClause: any, options?: any): Promise<AvisoGeral> {
    const opts = Object.assign({}, options, { where: whereClause });
    return getCustomRepository(AvisoGeralRepository).findOne(opts);
  }

  public static findManyBy(whereClause: any, options?: any): Promise<AvisoGeral[]> {
    const opts = Object.assign({}, options, { where: whereClause });
    return getCustomRepository(AvisoGeralRepository).find(opts);
  }

  public static bulkCreate(AvisoGerals: AvisoGeral[]): Promise<AvisoGeral[]> {
    return getCustomRepository(AvisoGeralRepository).bulkCreate(AvisoGerals);
  }

  public static remove(aviso: AvisoGeral): Promise<AvisoGeral> {
    return getCustomRepository(AvisoGeralRepository).remove(aviso);
  }

  public static removeById(id: number): Promise<AvisoGeral> {
    return getCustomRepository(AvisoGeralRepository).removeById(id);
  }

  public static save(aviso: AvisoGeral): Promise<AvisoGeral> {
    return getCustomRepository(AvisoGeralRepository).save(aviso);
  }

}
