import { getCustomRepository, Repository } from 'typeorm';
import { log } from '../../config/Logger';
import { Pessoa } from '../models/Pessoa.model';
import { PessoaRepository } from '../repository/Pessoa.repository';
import { UsuarioRepository } from '../repository/Usuario.repository';

export class PessoaService {

  public static findOneBy(whereClause: any, options?: any): Promise<Pessoa> {
    const opts = Object.assign({}, options, { where: whereClause });
    return getCustomRepository(PessoaRepository).findOne(opts);
  }

  public static findManyBy(whereClause: any, options?: any): Promise<Pessoa[]> {
    const opts = Object.assign({}, options, { where: whereClause });
    return getCustomRepository(PessoaRepository).find(opts);
  }

  public static async findOneByUserId(userId: number): Promise<Pessoa> {
    const user = await getCustomRepository(UsuarioRepository).createQueryBuilder('u')
                                                             .leftJoinAndSelect('u.pessoa', 'pessoa')
                                                             .where('u.id = :uid', {uid: userId})
                                                             .getOne();
    return PessoaService.findOneBy({id: user.pessoa.id});
  }

  public static remove(pessoa: Pessoa): Promise<Pessoa> {
    return getCustomRepository(PessoaRepository).remove(pessoa);
  }

  public static removeById(id: number): Promise<Pessoa> {
    return getCustomRepository(PessoaRepository).removeById(id);
  }

  public static save(pessoa: Pessoa): Promise<Pessoa> {
    return getCustomRepository(PessoaRepository).save(pessoa);
  }

}
