import { log } from '../../config/Logger';
import { getCustomRepository, Repository, DeepPartial, UpdateResult } from 'typeorm';
import { DebitoAutomatico } from '../models/Debito_automatico.model';
import { DebitoAutomaticoRepository } from '../repository/Debito_automatico.repository';
import { JobsToRun } from '../models/Jobs_to_run.model';
import { JobsToRunRepository } from '../repository/Jobs_to_run.repository';

export class DebitoAutomaticoService {

  private static getJobQuery(id: number): string {
    return `
INSERT INTO public.data (unix_timestamp, dia, mes, ano, dia_da_semana, semana_do_ano, hora, minuto, segundo)
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

INSERT INTO public.gasto (valor, tipo, obs, "dataUnixTimestamp", "categoriaId", "modoDePagamentoId", "pessoaId")
SELECT
       valor,
       tipo,
       obs,
       CAST( 1000*EXTRACT(EPOCH FROM NOW()) AS BIGINT)    AS "dataUnixTimeStamp",
       "categoriaId",
       "modoDePagamentoId",
       "pessoaId"
FROM public.debito_automatico
WHERE id=${id};
`;
  }

  private static getJobName(id: number): string {
    return `job__debito_automatico__${id}`;
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
          .where('name = :name', {
            name: this.getJobName(id),
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
          .where('name = :name', {
            name: this.getJobName(created.id),
          })
          .execute()
          .then(() => {
            // get when it is supposed to run next
            const now = new Date();
            const runAt = new Date(now.getFullYear(), now.getMonth(), created.dia_do_mes);
            if ( runAt.getTime() < now.getTime() ) {
              // run only next month
              runAt.setMonth(runAt.getMonth() + 1);
            }
            // create a row on JobsToRun
            return getCustomRepository(JobsToRunRepository)
              .createQueryBuilder()
              .insert()
              .into(JobsToRun)
              .values({
                name: this.getJobName(created.id),
                sql: this.getJobQuery(created.id),
                run_at: runAt,
                interval: '1 month',
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
