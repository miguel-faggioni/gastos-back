import { EntityRepository, Repository } from 'typeorm';
import { Usuario } from '../models/Usuario.model';

@EntityRepository(Usuario)
export class UsuarioRepository extends Repository<Usuario> {

  public bulkCreate(Usuarios: Usuario[]): Promise<any> {
    return this.manager.createQueryBuilder().insert().into(Usuario).values(Usuarios).execute();
  }

  public async removeById(id: number): Promise<Usuario> {
    const itemToRemove: Usuario = await this.findOne({id});
    return this.manager.remove(itemToRemove);
  }

  public findByText(text: string): Promise<Usuario[]> {
    return this.manager.find(Usuario, {where: {text}});
  }

  public findOneById(id: number): Promise<Usuario> {
    return this.manager.findOne(Usuario, {where: {id}});
  }

}
