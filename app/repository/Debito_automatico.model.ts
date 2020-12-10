import { EntityRepository, Repository } from 'typeorm';
import { DebitoAutomatico } from '../models/Debito_automatico.model';

@EntityRepository(DebitoAutomatico)
export class DebitoAutomaticoRepository extends Repository<DebitoAutomatico> {

}
