import { EntityRepository, Repository } from 'typeorm';
import { Data } from '../models/Data.model';

@EntityRepository(Data)
export class DataRepository extends Repository<Data> {

}
