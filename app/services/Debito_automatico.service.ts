import { getCustomRepository, Repository } from 'typeorm';
import { DebitoAutomatico } from '../models/Debito_automatico.model';
import { DebitoAutomaticoRepository } from '../repository/Debito_automatico.repository';

export class DebitoAutomaticoService {

  public static findOneBy(whereClause: any, options?: any): Promise<DebitoAutomatico> {
    const opts = Object.assign({}, options, { where: whereClause });
    return getCustomRepository(DebitoAutomaticoRepository).findOne(opts);
  }

  public static findManyBy(whereClause: any, options?: any): Promise<DebitoAutomatico[]> {
    const opts = Object.assign({}, options, { where: whereClause });
    return getCustomRepository(DebitoAutomaticoRepository).find(opts);
  }

  public static remove(debitoAutomatico: DebitoAutomatico): Promise<DebitoAutomatico> {
    return getCustomRepository(DebitoAutomaticoRepository).remove(debitoAutomatico);
  }

  public static save(debitoAutomatico: DebitoAutomatico): Promise<DebitoAutomatico> {
    return getCustomRepository(DebitoAutomaticoRepository).save(debitoAutomatico);
  }

}
