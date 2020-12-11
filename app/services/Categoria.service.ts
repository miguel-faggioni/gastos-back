import { getCustomRepository, Repository } from 'typeorm';
import { Categoria } from '../models/Categoria.model';
import { CategoriaRepository } from '../repository/Categoria.repository';

export class CategoriaService {

  public static findOneBy(whereClause: any, options?: any): Promise<Categoria> {
    const opts = Object.assign({}, options, { where: whereClause });
    return getCustomRepository(CategoriaRepository).findOne(opts);
  }

  public static findManyBy(whereClause: any, options?: any): Promise<Categoria[]> {
    const opts = Object.assign({}, options, { where: whereClause });
    return getCustomRepository(CategoriaRepository).find(opts);
  }

  public static remove(categoria: Categoria): Promise<Categoria> {
    return getCustomRepository(CategoriaRepository).remove(categoria);
  }

  public static save(categoria: Categoria): Promise<Categoria> {
    return getCustomRepository(CategoriaRepository).save(categoria);
  }

}
