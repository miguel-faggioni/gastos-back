import { log } from '../../config/Logger';
import { getCustomRepository, Repository, DeepPartial, UpdateResult } from 'typeorm';
import { DebitoAutomatico } from '../models/Debito_automatico.model';
import { DebitoAutomaticoRepository } from '../repository/Debito_automatico.repository';
import { JobsToRun } from '../models/Jobs_to_run.model';
import { JobsToRunRepository } from '../repository/Jobs_to_run.repository';

export class DebitoAutomaticoService {

  private static getJobQuery(id: number): string {
    return `
BEGIN TRANSACTION;

INSERT INTO data (unix_timestamp, dia, mes, ano, dia_da_semana, semana_do_ano, hora, minuto, segundo)
SELECT
       CAST( 1000*EXTRACT(EPOCH FROM NOW()) AS BIGINT)    AS unix_timestamp,
       DATE_PART('day',NOW())                             AS dia,
       DATE_PART('month',NOW())                           AS mes,
       DATE_PART('year',NOW())                            AS ano,
       DATE_PART('dow',NOW())                             AS dia_da_semana,
       DATE_PART('week',NOW())                            AS semana_do_ano,
       DATE_PART('hour',NOW())                            AS hora,
       DATE_PART('minute',NOW())                          AS minuto,
       CAST( DATE_PART('second',NOW()) AS SMALLINT)       AS segundo
ON CONFLICT DO NOTHING;

INSERT INTO gasto (valor, "dataUnixTimestamp", "categoriaId", "modoDePagamentoId", "pessoaId")
SELECT
       valor,
       CAST( 1000*EXTRACT(EPOCH FROM NOW()) AS BIGINT)    AS "dataUnixTimeStamp",
       "categoriaId",
       "modoDePagamentoId",
       "pessoaId"
FROM debito_automatico
WHERE id=${id};

COMMIT;
`;
  }

  public static findOneBy(whereClause: any, options?: any): Promise<DebitoAutomatico> {
    const opts = Object.assign({}, options, { where: whereClause });
    return getCustomRepository(DebitoAutomaticoRepository).findOne(opts);
  }

  public static findManyBy(whereClause: any, options?: any): Promise<DebitoAutomatico[]> {
    const opts = Object.assign({}, options, { where: whereClause });
    return getCustomRepository(DebitoAutomaticoRepository).find(opts);
  }

  public static remove(debitoAutomatico: DebitoAutomatico): Promise<DebitoAutomatico> {
    const id = debitoAutomatico.id;
    // remove entity
    return getCustomRepository(DebitoAutomaticoRepository)
      .remove(debitoAutomatico)
      .then((removed) => {
        // remove any old JobsToRun
        return getCustomRepository(JobsToRunRepository)
          .createQueryBuilder()
          .delete()
          .from(JobsToRun)
          .where('tabela = :tabela AND id_da_entidade = :id', {
            tabela: 'debito_automatico',
            id: id,
          })
          .execute()
          .then(() => {
            // return the original return value
            return removed;
          });
      });
  }

  public static save(debitoAutomatico: DebitoAutomatico): Promise<DebitoAutomatico> {
    // create entity
    return getCustomRepository(DebitoAutomaticoRepository)
      .save(debitoAutomatico)
      .then((created) => {
        // remove any old JobsToRun
        return getCustomRepository(JobsToRunRepository)
          .createQueryBuilder()
          .delete()
          .from(JobsToRun)
          .where('tabela = :tabela AND id_da_entidade = :id', {
            tabela: 'debito_automatico',
            id: created.id,
          })
          .execute()
          .then(() => {
            // create a row on JobsToRun
            return getCustomRepository(JobsToRunRepository)
              .createQueryBuilder()
              .insert()
              .into(JobsToRun)
              .values({
                dia_do_mes_pra_rodar: created.dia_do_mes,
                tabela: 'debito_automatico',
                id_da_entidade: created.id,
                sql: this.getJobQuery(created.id),
              })
              .execute()
              .then(() => {
                // return the original entity
                return created;
              });
          });
      });
  }

  public static update(criteria: {}, debitoAutomatico: DeepPartial<DebitoAutomatico>): Promise<UpdateResult> {
    return getCustomRepository(DebitoAutomaticoRepository).update(criteria, debitoAutomatico);
  }

}
