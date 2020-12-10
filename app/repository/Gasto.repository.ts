import { EntityRepository, Repository } from 'typeorm';
import { Gasto } from '../models/Gasto.model';

@EntityRepository(Gasto)
export class GastoRepository extends Repository<Gasto> {

}
