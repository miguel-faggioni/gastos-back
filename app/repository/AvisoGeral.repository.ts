import { EntityRepository, Repository } from 'typeorm';
import { AvisoGeral } from '../models/AvisoGeral.model';

@EntityRepository(AvisoGeral)
export class AvisoGeralRepository extends Repository<AvisoGeral> {

  public bulkCreate(AvisoGerals: AvisoGeral[]): Promise<any> {
    return this.manager.createQueryBuilder().insert().into(AvisoGeral).values(AvisoGerals).execute();
  }

  public async removeById(id: number): Promise<AvisoGeral> {
    const itemToRemove: AvisoGeral = await this.findOne({id});
    return this.manager.remove(itemToRemove);
  }

  public findByText(text: string): Promise<AvisoGeral[]> {
    return this.manager.find(AvisoGeral, {where: {text}});
  }

  public findOneById(id: number): Promise<AvisoGeral> {
    return this.manager.findOne(AvisoGeral, {where: {id}});
  }

}
