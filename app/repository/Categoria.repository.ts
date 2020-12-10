import { EntityRepository, Repository } from 'typeorm';
import { Categoria } from '../models/Categoria.model';

@EntityRepository(Categoria)
export class CategoriaRepository extends Repository<Categoria> {

}
