import { getCustomRepository, Repository } from 'typeorm';
import { Usuario } from '../models/Usuario.model';
import { PessoaRepository } from '../repository/Pessoa.repository';
import { UsuarioRepository } from '../repository/Usuario.repository';

export class UsuarioService {

  public static async findOneByPessoaId(pessoaId: number): Promise<Usuario> {
    const pessoa = await getCustomRepository(PessoaRepository).createQueryBuilder('p')
                                                              .innerJoinAndSelect('p.usuario', 'usuario')
                                                              .where('p.id = :pid', {pid: pessoaId})
                                                              .getOne();
    return this.findOneBy({id: pessoa.usuario.id});
  }

  public static findOneBy(whereClause: any, options?: any): Promise<Usuario> {
    const opts = Object.assign({}, options, { where: whereClause });
    return getCustomRepository(UsuarioRepository).findOne(opts);
  }

  public static findManyBy(whereClause: any, options?: any): Promise<Usuario[]> {
    const opts = Object.assign({}, options, { where: whereClause });
    return getCustomRepository(UsuarioRepository).find(opts);
  }

  public static remove(usuario: Usuario): Promise<Usuario> {
    return getCustomRepository(UsuarioRepository).remove(usuario);
  }

  public static removeById(id: number): Promise<Usuario> {
    return getCustomRepository(UsuarioRepository).removeById(id);
  }

  public static save(usuario: Usuario): Promise<Usuario> {
    return getCustomRepository(UsuarioRepository).save(usuario);
  }

}
