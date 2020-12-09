import { BaseEntity, Column, Entity,
         OneToMany,
         PrimaryColumn,
} from 'typeorm';

import { Gasto } from './Gasto.model';

@Entity('data')
export class Data extends BaseEntity {

  @PrimaryColumn('bigint')
  public unix_timestamp: number;

  @Column('smallint')
  public dia: number;

  @Column('smallint')
  public mes: number;

  @Column('smallint')
  public ano: number;

  @Column('smallint')
  public dia_da_semana: number;

  @Column('smallint')
  public semana_do_ano: number;

  @Column('smallint')
  public hora: number;

  @Column('smallint')
  public minuto: number;

  @Column('smallint')
  public segundo: number;

  @OneToMany(() => Gasto, gasto => gasto.data)
  public gastos: Gasto[];

}
