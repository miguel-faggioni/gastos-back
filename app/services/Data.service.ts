import { getCustomRepository, Repository } from 'typeorm';
import { Data } from '../models/Data.model';
import { DataRepository } from '../repository/Data.repository';

export class DataService {

  public static findOneBy(whereClause: any, options?: any): Promise<Data> {
    const opts = Object.assign({}, options, { where: whereClause });
    return getCustomRepository(DataRepository).findOne(opts);
  }

  public static findManyBy(whereClause: any, options?: any): Promise<Data[]> {
    const opts = Object.assign({}, options, { where: whereClause });
    return getCustomRepository(DataRepository).find(opts);
  }

  public static remove(data: Data): Promise<Data> {
    return getCustomRepository(DataRepository).remove(data);
  }

  public static save(data: Data): Promise<Data> {
    return getCustomRepository(DataRepository).save(data);
  }

}
