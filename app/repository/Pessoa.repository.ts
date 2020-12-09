import { EntityRepository, Repository } from 'typeorm';
import { Pessoa } from '../models/Pessoa.model';

@EntityRepository(Pessoa)
export class PessoaRepository extends Repository<Pessoa> {

  public async removeById(id: number): Promise<Pessoa> {
    const itemToRemove: Pessoa = await this.findOne({id});
    return this.manager.remove(itemToRemove);
  }

  public findByText(text: string): Promise<Pessoa[]> {
    return this.manager.find(Pessoa, {where: {text}});
  }

  public findOneById(id: number): Promise<Pessoa> {
    return this.manager.findOne(Pessoa, {where: {id}});
  }

}
